import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const { Pool } = pg;

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "boss-tags.json");

export function normalizeTagName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function cleanDisplayName(name) {
  return name.trim().replace(/\s+/g, " ").slice(0, 60);
}

function createEmptyData() {
  return { guilds: {} };
}

class JsonTagStore {
  constructor() {
    this.label = "local-json";
  }

  async init() {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
      await fs.access(DATA_FILE);
    } catch {
      await this.write(createEmptyData());
    }
  }

  async read() {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw);
  }

  async write(data) {
    await fs.writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  }

  getGuild(data, guildId) {
    data.guilds[guildId] ||= { tags: {} };
    return data.guilds[guildId];
  }

  async createTag(guildId, name, createdBy) {
    const tagKey = normalizeTagName(name);
    const displayName = cleanDisplayName(name);
    const data = await this.read();
    const guild = this.getGuild(data, guildId);

    if (guild.tags[tagKey]) {
      return { created: false, tag: guild.tags[tagKey] };
    }

    guild.tags[tagKey] = {
      tagKey,
      displayName,
      createdBy,
      createdAt: new Date().toISOString(),
      members: {}
    };
    await this.write(data);
    return { created: true, tag: guild.tags[tagKey] };
  }

  async deleteTag(guildId, name) {
    const tagKey = normalizeTagName(name);
    const data = await this.read();
    const guild = this.getGuild(data, guildId);

    if (!guild.tags[tagKey]) return false;

    delete guild.tags[tagKey];
    await this.write(data);
    return true;
  }

  async getTag(guildId, name) {
    const tagKey = normalizeTagName(name);
    const data = await this.read();
    const guild = this.getGuild(data, guildId);
    return guild.tags[tagKey] || null;
  }

  async listTags(guildId) {
    const data = await this.read();
    const guild = this.getGuild(data, guildId);
    return Object.values(guild.tags)
      .map(tag => ({ ...tag, memberCount: Object.keys(tag.members || {}).length }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  async joinTag(guildId, name, userId) {
    const tagKey = normalizeTagName(name);
    const data = await this.read();
    const guild = this.getGuild(data, guildId);
    const tag = guild.tags[tagKey];

    if (!tag) return { ok: false, reason: "missing" };

    const alreadyJoined = Boolean(tag.members[userId]);
    tag.members[userId] ||= new Date().toISOString();
    await this.write(data);
    return { ok: true, alreadyJoined, tag };
  }

  async leaveTag(guildId, name, userId) {
    const tagKey = normalizeTagName(name);
    const data = await this.read();
    const guild = this.getGuild(data, guildId);
    const tag = guild.tags[tagKey];

    if (!tag) return { ok: false, reason: "missing" };
    if (!tag.members[userId]) return { ok: true, wasMember: false, tag };

    delete tag.members[userId];
    await this.write(data);
    return { ok: true, wasMember: true, tag };
  }

  async listMembers(guildId, name) {
    const tag = await this.getTag(guildId, name);
    if (!tag) return null;

    return {
      tag,
      members: Object.keys(tag.members || {})
    };
  }
}

class PostgresTagStore {
  constructor(databaseUrl) {
    this.label = "postgres";
    this.pool = new Pool({ connectionString: databaseUrl });
  }

  async init() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS boss_tags (
        guild_id TEXT NOT NULL,
        tag_key TEXT NOT NULL,
        display_name TEXT NOT NULL,
        created_by TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (guild_id, tag_key)
      );

      CREATE TABLE IF NOT EXISTS boss_tag_members (
        guild_id TEXT NOT NULL,
        tag_key TEXT NOT NULL,
        user_id TEXT NOT NULL,
        joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (guild_id, tag_key, user_id),
        FOREIGN KEY (guild_id, tag_key)
          REFERENCES boss_tags (guild_id, tag_key)
          ON DELETE CASCADE
      );
    `);
  }

  rowToTag(row) {
    return {
      tagKey: row.tag_key,
      displayName: row.display_name,
      createdBy: row.created_by,
      createdAt: row.created_at
    };
  }

  async createTag(guildId, name, createdBy) {
    const tagKey = normalizeTagName(name);
    const displayName = cleanDisplayName(name);
    const result = await this.pool.query(
      `INSERT INTO boss_tags (guild_id, tag_key, display_name, created_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (guild_id, tag_key) DO NOTHING
       RETURNING *`,
      [guildId, tagKey, displayName, createdBy]
    );

    if (result.rows[0]) {
      return { created: true, tag: this.rowToTag(result.rows[0]) };
    }

    const existing = await this.getTag(guildId, name);
    return { created: false, tag: existing };
  }

  async deleteTag(guildId, name) {
    const tagKey = normalizeTagName(name);
    const result = await this.pool.query(
      "DELETE FROM boss_tags WHERE guild_id = $1 AND tag_key = $2",
      [guildId, tagKey]
    );
    return result.rowCount > 0;
  }

  async getTag(guildId, name) {
    const tagKey = normalizeTagName(name);
    const result = await this.pool.query(
      "SELECT * FROM boss_tags WHERE guild_id = $1 AND tag_key = $2",
      [guildId, tagKey]
    );
    return result.rows[0] ? this.rowToTag(result.rows[0]) : null;
  }

  async listTags(guildId) {
    const result = await this.pool.query(
      `SELECT bt.*, COUNT(btm.user_id)::INT AS member_count
       FROM boss_tags bt
       LEFT JOIN boss_tag_members btm
         ON btm.guild_id = bt.guild_id AND btm.tag_key = bt.tag_key
       WHERE bt.guild_id = $1
       GROUP BY bt.guild_id, bt.tag_key, bt.display_name, bt.created_by, bt.created_at
       ORDER BY bt.display_name ASC`,
      [guildId]
    );

    return result.rows.map(row => ({
      ...this.rowToTag(row),
      memberCount: row.member_count
    }));
  }

  async joinTag(guildId, name, userId) {
    const tag = await this.getTag(guildId, name);
    if (!tag) return { ok: false, reason: "missing" };

    const result = await this.pool.query(
      `INSERT INTO boss_tag_members (guild_id, tag_key, user_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (guild_id, tag_key, user_id) DO NOTHING`,
      [guildId, tag.tagKey, userId]
    );

    return { ok: true, alreadyJoined: result.rowCount === 0, tag };
  }

  async leaveTag(guildId, name, userId) {
    const tag = await this.getTag(guildId, name);
    if (!tag) return { ok: false, reason: "missing" };

    const result = await this.pool.query(
      "DELETE FROM boss_tag_members WHERE guild_id = $1 AND tag_key = $2 AND user_id = $3",
      [guildId, tag.tagKey, userId]
    );

    return { ok: true, wasMember: result.rowCount > 0, tag };
  }

  async listMembers(guildId, name) {
    const tag = await this.getTag(guildId, name);
    if (!tag) return null;

    const result = await this.pool.query(
      `SELECT user_id
       FROM boss_tag_members
       WHERE guild_id = $1 AND tag_key = $2
       ORDER BY joined_at ASC`,
      [guildId, tag.tagKey]
    );

    return {
      tag,
      members: result.rows.map(row => row.user_id)
    };
  }
}

export async function createTagStore() {
  const store = process.env.DATABASE_URL
    ? new PostgresTagStore(process.env.DATABASE_URL)
    : new JsonTagStore();

  await store.init();
  return store;
}
