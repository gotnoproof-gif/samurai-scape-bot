import { trimForDiscord } from "./utils.js";

const validSkills = new Set([
  "attack",
  "strength",
  "defence",
  "ranged",
  "prayer",
  "magic",
  "runecraft",
  "hitpoints",
  "crafting",
  "mining",
  "smithing",
  "fishing",
  "cooking",
  "firemaking",
  "woodcutting",
  "agility",
  "herblore",
  "thieving",
  "fletching",
  "slayer",
  "farming",
  "construction",
  "hunter"
]);

function requireGuild(interaction) {
  if (!interaction.guildId) {
    return "XP commands only work inside a Discord server.";
  }

  return null;
}

function cleanSkillName(skill) {
  return skill.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 40);
}

function displaySkillName(skill) {
  return cleanSkillName(skill).replace(/\b\w/g, letter => letter.toUpperCase());
}

function formatXp(value) {
  return Number(value || 0).toLocaleString("en-US");
}

function estimateLevelFromXp(xp) {
  let points = 0;

  for (let level = 1; level <= 99; level += 1) {
    points += Math.floor(level + 300 * Math.pow(2, level / 7));
    const needed = Math.floor(points / 4);
    if (needed > xp) {
      return level;
    }
  }

  return 99;
}

async function addXp(interaction, store) {
  const skill = cleanSkillName(interaction.options.getString("skill", true));
  const amount = interaction.options.getInteger("amount", true);
  const note = interaction.options.getString("note");

  const result = await store.addXp(interaction.guildId, interaction.user.id, skill, amount);
  const estimatedLevel = estimateLevelFromXp(result.totalXp);
  const skillName = displaySkillName(skill);
  const validationNote = validSkills.has(skill)
    ? ""
    : "\nSmall note: I saved that as a custom skill name.";

  await interaction.editReply(trimForDiscord([
    `**XP drop: ${skillName}**`,
    `${interaction.user} gains **${formatXp(amount)} XP**.`,
    `Tracked total: **${formatXp(result.totalXp)} XP**. Estimated level: **${estimatedLevel}**.`,
    note ? `Note: ${note}` : "",
    validationNote
  ].filter(Boolean).join("\n")));
}

async function announceLevel(interaction) {
  const skill = displaySkillName(interaction.options.getString("skill", true));
  const level = interaction.options.getInteger("level", true);
  const note = interaction.options.getString("note");

  await interaction.editReply(trimForDiscord([
    `**Level up!** ${interaction.user} reached **${level} ${skill}**.`,
    "The dojo pauses for the sparkle.",
    note ? `Note: ${note}` : ""
  ].filter(Boolean).join("\n")));
}

function formatLeaderboard(rows, skill) {
  if (!rows.length) {
    return skill
      ? `No XP tracked for **${displaySkillName(skill)}** yet.`
      : "No XP tracked yet. Use `/xp gain` after a grind.";
  }

  const title = skill ? `**${displaySkillName(skill)} XP leaderboard**` : "**Total XP leaderboard**";
  return [
    title,
    ...rows.map((row, index) => `${index + 1}. <@${row.userId}> - **${formatXp(row.totalXp)} XP**`)
  ].join("\n");
}

async function showLeaderboard(interaction, store) {
  const skill = interaction.options.getString("skill");
  const rows = await store.listXpLeaderboard(
    interaction.guildId,
    skill ? cleanSkillName(skill) : null,
    10
  );

  await interaction.editReply({
    content: formatLeaderboard(rows, skill),
    allowedMentions: { parse: [] }
  });
}

async function resetXp(interaction, store) {
  const skill = interaction.options.getString("skill");
  await store.resetXp(interaction.guildId, interaction.user.id, skill ? cleanSkillName(skill) : null);

  await interaction.editReply(skill
    ? `Your tracked **${displaySkillName(skill)}** XP has been reset.`
    : "Your tracked XP has been reset.");
}

export async function handleXpCommand(interaction, store) {
  const guildError = requireGuild(interaction);
  if (guildError) {
    await interaction.editReply(guildError);
    return;
  }

  const subcommand = interaction.options.getSubcommand();

  if (subcommand === "gain") {
    await addXp(interaction, store);
    return;
  }

  if (subcommand === "level") {
    await announceLevel(interaction);
    return;
  }

  if (subcommand === "board") {
    await showLeaderboard(interaction, store);
    return;
  }

  if (subcommand === "reset") {
    await resetXp(interaction, store);
  }
}

