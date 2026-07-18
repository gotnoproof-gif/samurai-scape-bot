import { getRandomQuote } from "./quoteBank.js";
import { randomItem, trimForDiscord } from "./utils.js";

const DEFAULT_CHAT_EVENT_CHANCE = 0.10;
const DEFAULT_CHAT_COOLDOWN_MS = 240000;
const DEFAULT_USER_XP_COOLDOWN_MS = 900000;
const DEFAULT_MIN_MESSAGE_LENGTH = 5;
const DEFAULT_XP_MIN = 10;
const DEFAULT_XP_MAX = 30;
const DEFAULT_TIMER_MINUTES = 30;
const DEFAULT_TIMER_POST_CHANCE = 0.65;
const ACTIVE_CHANNEL_TTL_MS = 21600000;

const ranks = [
  { name: "Dojo Sweeper", minXp: 0 },
  { name: "Wooden Blade Student", minXp: 100 },
  { name: "Bronze Ronin", minXp: 250 },
  { name: "Iron Katana Initiate", minXp: 500 },
  { name: "Steel Clan Samurai", minXp: 900 },
  { name: "Dragon Ronin", minXp: 1400 },
  { name: "Barrows Blade Warden", minXp: 2200 },
  { name: "Gielinor Shogun", minXp: 3500 }
];

const storyBeats = [
  "A dusty dojo door opens in Lumbridge. The first lesson is simple: show up.",
  "The ronin hands over a wooden blade and points toward the training yard.",
  "A bankstanding elder teaches the sacred art of bringing the right item before leaving.",
  "A goblin duel becomes a lesson in timing, snacks, and humility.",
  "The clan forge sparks. A chipped blade becomes a weapon with a name.",
  "The path leads through Varrock, where patience is tested harder than combat.",
  "A quiet night at the Grand Exchange reveals that discipline beats lucky flips.",
  "The first boss door creaks open. Fear enters first, courage follows anyway.",
  "A prayer flick lands clean. The ancestors pretend they expected it.",
  "The ronin studies a clue scroll and learns that wisdom sometimes requires a spade.",
  "A raid bell rings in the distance. The clan starts remembering who packed supplies.",
  "The blade earns its wrap. The student is no longer just surviving the path.",
  "A rival appears in the Wilderness fog. The lesson is risk, restraint, and a teleport.",
  "The dojo lantern burns blue. The clan now watches this warrior for signs of greatness.",
  "A final scroll is sealed. The road to samurai is no longer a rumor."
];

const xpReasons = [
  "honorable chatter",
  "dojo presence",
  "clan spirit",
  "bankstanding discipline",
  "battlefield confidence",
  "quiet grinding",
  "ronin potential"
];

const timerLines = [
  "The dojo bell rings. Stretch the hands, check supplies, and keep the blade sharp.",
  "A wandering ronin passes through chat and leaves a lesson behind.",
  "The clan lantern flickers. Someone is due for a level, a drop, or a questionable plan.",
  "Timer scroll: bank your loot, sip water, and do not trust an empty inventory.",
  "The path continues even while the server rests."
];

function getBooleanEnv(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function getNumberEnv(name, fallback, min, max) {
  const value = Number(process.env[name]);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

function cleanContent(content) {
  return content
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/<@!?\d+>/g, " ")
    .replace(/<@&\d+>/g, " ")
    .replace(/<#\d+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function randomXpAmount() {
  const min = getNumberEnv("SAMURAI_XP_MIN", DEFAULT_XP_MIN, 1, 10000);
  const max = getNumberEnv("SAMURAI_XP_MAX", DEFAULT_XP_MAX, min, 10000);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rankForXp(xp) {
  return ranks.reduce((current, rank) => (xp >= rank.minXp ? rank : current), ranks[0]);
}

function nextRankForXp(xp) {
  return ranks.find(rank => rank.minXp > xp) || null;
}

function storyForStep(step) {
  return storyBeats[step % storyBeats.length];
}

function formatProgressBar(totalXp) {
  const nextRank = nextRankForXp(totalXp);
  if (!nextRank) return "Progress: mastered";

  const currentRank = rankForXp(totalXp);
  const span = nextRank.minXp - currentRank.minXp;
  const gained = totalXp - currentRank.minXp;
  const filled = Math.max(0, Math.min(10, Math.floor((gained / span) * 10)));

  return `[${"#".repeat(filled)}${"-".repeat(10 - filled)}] ${totalXp}/${nextRank.minXp} XP`;
}

function formatProgress(user, progress) {
  const totalXp = Number(progress?.totalXp || 0);
  const storyStep = Number(progress?.storyStep || 0);
  const currentRank = rankForXp(totalXp);
  const nextRank = nextRankForXp(totalXp);

  return trimForDiscord([
    `**${user.username}'s samurai path**`,
    `Rank: **${currentRank.name}**`,
    `Path XP: **${totalXp.toLocaleString("en-US")}**`,
    formatProgressBar(totalXp),
    nextRank ? `Next rank: **${nextRank.name}** at **${nextRank.minXp.toLocaleString("en-US")} XP**.` : "Final rank reached. The dojo bows.",
    `Story chapter: **${storyStep + 1}**`,
    storyForStep(storyStep)
  ].join("\n"));
}

function formatXpAward(user, progress, amount) {
  const previousRank = rankForXp(Number(progress.previousXp || 0));
  const currentRank = rankForXp(Number(progress.totalXp || 0));
  const rankedUp = previousRank.name !== currentRank.name;

  return trimForDiscord([
    `**Samurai path XP**`,
    `${user} gains **${amount} path XP** for ${randomItem(xpReasons)}.`,
    `Rank: **${currentRank.name}** | Total: **${Number(progress.totalXp || 0).toLocaleString("en-US")} XP**`,
    rankedUp ? `**Rank up:** ${previousRank.name} -> ${currentRank.name}` : "",
    storyForStep(Number(progress.storyStep || 1) - 1)
  ].filter(Boolean).join("\n"));
}

function formatLeaderboard(rows) {
  if (!rows.length) {
    return "No samurai path progress yet. Talk in chat or use `/samurai train`.";
  }

  return [
    "**Samurai path leaderboard**",
    ...rows.map((row, index) => {
      const rank = rankForXp(Number(row.totalXp || 0));
      return `${index + 1}. <@${row.userId}> - **${Number(row.totalXp || 0).toLocaleString("en-US")} XP**, ${rank.name}`;
    })
  ].join("\n");
}

export function samuraiPathIsEnabled() {
  return getBooleanEnv("SAMURAI_PATH_ENABLED", true);
}

export function samuraiTimerIsEnabled() {
  return samuraiPathIsEnabled() && getBooleanEnv("SAMURAI_TIMER_ENABLED", true);
}

export function samuraiPathWantsMessageContent() {
  return samuraiPathIsEnabled() && getBooleanEnv("MESSAGE_CONTENT_INTENT_ENABLED", false);
}

export function createSamuraiPathSystem(store) {
  const lastEventByChannel = new Map();
  const lastXpByUser = new Map();
  const activeChannels = new Map();

  async function handleMessage(message) {
    if (!samuraiPathIsEnabled()) return false;
    if (!message.guildId || !message.channelId || !message.content) return false;
    if (message.content.startsWith("/") || message.content.startsWith("!")) return false;

    const cleaned = cleanContent(message.content);
    const minLength = getNumberEnv("SAMURAI_MIN_MESSAGE_LENGTH", DEFAULT_MIN_MESSAGE_LENGTH, 1, 200);
    if (cleaned.length < minLength) return false;

    activeChannels.set(message.channelId, {
      channel: message.channel,
      guildId: message.guildId,
      lastSeenAt: Date.now()
    });

    const cooldownMs = getNumberEnv("SAMURAI_CHAT_COOLDOWN_MS", DEFAULT_CHAT_COOLDOWN_MS, 10000, 3600000);
    const lastChannelEvent = lastEventByChannel.get(message.channelId) || 0;
    if (Date.now() - lastChannelEvent < cooldownMs) return false;

    const eventChance = getNumberEnv("SAMURAI_CHAT_EVENT_CHANCE", DEFAULT_CHAT_EVENT_CHANCE, 0, 1);
    if (Math.random() > eventChance) return false;

    lastEventByChannel.set(message.channelId, Date.now());

    const userCooldownMs = getNumberEnv("SAMURAI_USER_XP_COOLDOWN_MS", DEFAULT_USER_XP_COOLDOWN_MS, 10000, 86400000);
    const lastUserXp = lastXpByUser.get(`${message.guildId}:${message.author.id}`) || 0;
    const canAwardXp = Date.now() - lastUserXp >= userCooldownMs;

    if (canAwardXp && Math.random() < 0.65) {
      const amount = randomXpAmount();
      const progress = await store.addSamuraiXp(message.guildId, message.author.id, amount);
      lastXpByUser.set(`${message.guildId}:${message.author.id}`, Date.now());

      await message.reply({
        content: formatXpAward(message.author, progress, amount),
        allowedMentions: { users: [message.author.id], repliedUser: false }
      });
      return true;
    }

    await store.touchSamuraiProgress(message.guildId, message.author.id);
    await message.reply({
      content: trimForDiscord(`**Ronin quote:** ${getRandomQuote("random")}`, 800),
      allowedMentions: { parse: [], repliedUser: false }
    });
    return true;
  }

  function startTimer() {
    if (!samuraiTimerIsEnabled()) return null;

    const intervalMs = getNumberEnv("SAMURAI_TIMER_MINUTES", DEFAULT_TIMER_MINUTES, 5, 1440) * 60 * 1000;
    const timer = setInterval(async () => {
      try {
        const now = Date.now();
        for (const [channelId, info] of activeChannels.entries()) {
          if (now - info.lastSeenAt > ACTIVE_CHANNEL_TTL_MS) {
            activeChannels.delete(channelId);
          }
        }

        const channels = Array.from(activeChannels.values());
        if (!channels.length) return;

        const chance = getNumberEnv("SAMURAI_TIMER_POST_CHANCE", DEFAULT_TIMER_POST_CHANCE, 0, 1);
        if (Math.random() > chance) return;

        const { channel } = randomItem(channels);
        await channel.send(trimForDiscord(randomItem([
          `**Dojo timer:** ${randomItem(timerLines)}`,
          `**Dojo timer quote:** ${getRandomQuote("samurai")}`,
          `**Dojo timer scroll:** ${getRandomQuote("runescape")}`
        ]), 800));
      } catch (error) {
        console.error("Samurai timer failed", error);
      }
    }, intervalMs);

    timer.unref?.();
    return timer;
  }

  return {
    handleMessage,
    startTimer
  };
}

export async function handleSamuraiCommand(interaction, store) {
  if (!interaction.guildId) {
    await interaction.editReply("Samurai path progress only works inside a Discord server.");
    return;
  }

  const subcommand = interaction.options.getSubcommand();

  if (subcommand === "path") {
    const user = interaction.options.getUser("user") || interaction.user;
    const progress = await store.getSamuraiProgress(interaction.guildId, user.id)
      || await store.touchSamuraiProgress(interaction.guildId, user.id);

    await interaction.editReply({
      content: formatProgress(user, progress),
      allowedMentions: { parse: [] }
    });
    return;
  }

  if (subcommand === "train") {
    const action = interaction.options.getString("action") || "training with the clan";
    const amount = randomXpAmount() + 25;
    const progress = await store.addSamuraiXp(interaction.guildId, interaction.user.id, amount);

    await interaction.editReply(trimForDiscord([
      formatXpAward(interaction.user, progress, amount),
      `Training note: ${action}`
    ].join("\n")));
    return;
  }

  if (subcommand === "board") {
    const rows = await store.listSamuraiLeaderboard(interaction.guildId, 10);
    await interaction.editReply({
      content: formatLeaderboard(rows),
      allowedMentions: { parse: [] }
    });
  }
}
