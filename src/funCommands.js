import { randomItem } from "./utils.js";

const eightBallAnswers = [
  "The omens say yes.",
  "The Grand Exchange whispers no.",
  "Ask again after banking your loot.",
  "A wise ronin would bring food first.",
  "The path is risky, but the drop table smiles.",
  "Not today. Sharpen the blade and return."
];

const rareDrops = [
  "dragon med helm",
  "onyx-tipped katana",
  "rune platebody",
  "clue scroll sealed with red wax",
  "pet rock with suspicious combat stats",
  "pile of coins and a bruised ego",
  "teleport tab, slightly chewed",
  "shark dinner for the clan"
];

const combatLines = [
  "You bow, strike first, and somehow splash on a goblin.",
  "Your blade flashes like a special attack. The bank tab grows wiser.",
  "You eat at 80 HP. The ancestors nod approvingly.",
  "You forgot prayer. The ronin writes this down as a lesson.",
  "The boss roars. You answer with steel, snacks, and questionable pathing.",
  "A perfect flick, a clean hit, and a very loud clan chat."
];

export async function handleFunCommand(interaction) {
  if (interaction.commandName === "roll") {
    const sides = interaction.options.getInteger("sides") || 100;
    const roll = Math.floor(Math.random() * sides) + 1;
    await interaction.editReply(`${interaction.user} rolls **${roll}** out of **${sides}**.`);
    return true;
  }

  if (interaction.commandName === "coin") {
    await interaction.editReply(`The ronin flips a coin: **${randomItem(["heads", "tails"])}**.`);
    return true;
  }

  if (interaction.commandName === "drop") {
    const boss = interaction.options.getString("boss") || "the boss";
    await interaction.editReply(`**${boss}** drops: **${randomItem(rareDrops)}**.`);
    return true;
  }

  if (interaction.commandName === "oracle") {
    const question = interaction.options.getString("question", true);
    await interaction.editReply(`**Question:** ${question}\n**Ronin oracle:** ${randomItem(eightBallAnswers)}`);
    return true;
  }

  if (interaction.commandName === "duel") {
    const opponent = interaction.options.getString("opponent") || "the wilderness";
    await interaction.editReply(`**${interaction.user.username} vs ${opponent}**\n${randomItem(combatLines)}`);
    return true;
  }

  return false;
}
