import { PermissionFlagsBits } from "discord.js";

function requireGuild(interaction) {
  if (!interaction.guildId) {
    return "Boss tags only work inside a Discord server.";
  }

  return null;
}

function canManageTags(interaction) {
  return interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)
    || interaction.memberPermissions?.has(PermissionFlagsBits.Administrator);
}

function userMentions(userIds) {
  return userIds.map(userId => `<@${userId}>`);
}

function missingTagReply(name) {
  return `No boss tag named **${name}** exists yet. Ask an officer to create it with \`/boss create name:${name}\`.`;
}

function formatMemberList(tag, members) {
  if (!members.length) {
    return `**${tag.displayName}** has no warriors signed up yet.`;
  }

  const mentions = userMentions(members);
  const shown = mentions.slice(0, 60).join("\n");
  const remaining = mentions.length > 60 ? `\n...and ${mentions.length - 60} more.` : "";

  return [
    `**${tag.displayName}** tag members (${members.length})`,
    shown,
    remaining
  ].filter(Boolean).join("\n");
}

function formatTagList(tags) {
  if (!tags.length) {
    return "No boss tags yet. An officer can create one with `/boss create name:Nex`.";
  }

  return [
    "**Boss tags**",
    ...tags.map(tag => `- **${tag.displayName}**: ${tag.memberCount} warrior${tag.memberCount === 1 ? "" : "s"}`)
  ].join("\n");
}

async function createBossTag(interaction, tagStore) {
  if (!canManageTags(interaction)) {
    await interaction.editReply("Only server managers can create boss tags.");
    return;
  }

  const name = interaction.options.getString("name", true);
  const result = await tagStore.createTag(interaction.guildId, name, interaction.user.id);

  if (!result.created) {
    await interaction.editReply(`The **${result.tag.displayName}** boss tag already exists.`);
    return;
  }

  await interaction.editReply(`Boss tag created: **${result.tag.displayName}**. Warriors can join with \`/boss join name:${result.tag.displayName}\`.`);
}

async function deleteBossTag(interaction, tagStore) {
  if (!canManageTags(interaction)) {
    await interaction.editReply("Only server managers can delete boss tags.");
    return;
  }

  const name = interaction.options.getString("name", true);
  const deleted = await tagStore.deleteTag(interaction.guildId, name);

  await interaction.editReply(deleted
    ? `Boss tag deleted: **${name}**.`
    : missingTagReply(name));
}

async function joinBossTag(interaction, tagStore) {
  const name = interaction.options.getString("name", true);
  const result = await tagStore.joinTag(interaction.guildId, name, interaction.user.id);

  if (!result.ok) {
    await interaction.editReply(missingTagReply(name));
    return;
  }

  await interaction.editReply(result.alreadyJoined
    ? `You are already signed up for **${result.tag.displayName}**.`
    : `You joined **${result.tag.displayName}**. When someone pings that boss, your blade will be called.`);
}

async function leaveBossTag(interaction, tagStore) {
  const name = interaction.options.getString("name", true);
  const result = await tagStore.leaveTag(interaction.guildId, name, interaction.user.id);

  if (!result.ok) {
    await interaction.editReply(missingTagReply(name));
    return;
  }

  await interaction.editReply(result.wasMember
    ? `You left **${result.tag.displayName}**.`
    : `You were not signed up for **${result.tag.displayName}**.`);
}

async function listBossTags(interaction, tagStore) {
  const name = interaction.options.getString("name");

  if (name) {
    const result = await tagStore.listMembers(interaction.guildId, name);

    if (!result) {
      await interaction.editReply(missingTagReply(name));
      return;
    }

    await interaction.editReply({
      content: formatMemberList(result.tag, result.members),
      allowedMentions: { parse: [] }
    });
    return;
  }

  const tags = await tagStore.listTags(interaction.guildId);
  await interaction.editReply(formatTagList(tags));
}

async function pingBossTag(interaction, tagStore) {
  const name = interaction.options.getString("name", true);
  const note = interaction.options.getString("message") || "Gear up. The boss door opens.";
  const result = await tagStore.listMembers(interaction.guildId, name);

  if (!result) {
    await interaction.editReply(missingTagReply(name));
    return;
  }

  if (!result.members.length) {
    await interaction.editReply(`No one is signed up for **${result.tag.displayName}** yet.`);
    return;
  }

  const mentions = userMentions(result.members);
  const mentionText = mentions.join(" ");
  const content = [
    `**${result.tag.displayName} boss tag**`,
    `${interaction.user} calls the warriors.`,
    mentionText,
    note
  ].join("\n");

  await interaction.editReply({
    content: content.slice(0, 1900),
    allowedMentions: { users: result.members }
  });
}

export async function handleBossCommand(interaction, tagStore) {
  const guildError = requireGuild(interaction);

  if (guildError) {
    await interaction.editReply(guildError);
    return;
  }

  const subcommand = interaction.options.getSubcommand();

  if (subcommand === "create") {
    await createBossTag(interaction, tagStore);
    return;
  }

  if (subcommand === "delete") {
    await deleteBossTag(interaction, tagStore);
    return;
  }

  if (subcommand === "join") {
    await joinBossTag(interaction, tagStore);
    return;
  }

  if (subcommand === "leave") {
    await leaveBossTag(interaction, tagStore);
    return;
  }

  if (subcommand === "list") {
    await listBossTags(interaction, tagStore);
    return;
  }

  if (subcommand === "ping") {
    await pingBossTag(interaction, tagStore);
  }
}
