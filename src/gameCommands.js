import { createMemePost } from "./memeImages.js";
import { getRandomQuote } from "./quoteBank.js";
import { randomItem, trimForDiscord } from "./utils.js";

const profileTitles = [
  "Bankstanding Blade",
  "Prayer-Flick Ronin",
  "Grand Exchange Duelist",
  "Loot Lantern Keeper",
  "Cape-Chasing Wanderer",
  "Raid Bell Striker",
  "Dojo Quartermaster"
];

const combatStyles = [
  "calculated panic",
  "honorable bonks",
  "suspicious luck",
  "clean mechanics",
  "maximum snacks",
  "late-night confidence",
  "economical chaos"
];

const profileQuests = [
  "organize the bank tab before the next raid",
  "gain one level and loudly announce it",
  "teach a newer player one useful trick",
  "survive the boss and pretend it was planned",
  "bring extra supplies for the warrior who forgot"
];

const roastLines = [
  "Your inventory setup has the energy of a puzzle box.",
  "Your RNG files complaints when you enter the room.",
  "You gear like the bank asked you to improvise.",
  "Your special attack bar deserves a motivational speech.",
  "You click with courage. Accuracy is still negotiating."
];

const complimentLines = [
  "Your aura says rare drop incoming.",
  "The clan bank sleeps better with you online.",
  "Your clicks have discipline and your snacks have purpose.",
  "You bring main-character energy to the boss door.",
  "The ronin respects your grind."
];

const triviaQuestions = [
  {
    question: "What combat triangle style is strongest against magic in Old School RuneScape?",
    answer: "Ranged."
  },
  {
    question: "What item type is commonly used to leave danger fast?",
    answer: "A teleport."
  },
  {
    question: "What cape is commonly used to show a level 99 skill?",
    answer: "A skillcape."
  },
  {
    question: "What does GE usually mean in RuneScape chat?",
    answer: "Grand Exchange."
  },
  {
    question: "What should you check before most boss fights?",
    answer: "Food, prayer, potions, gear risk, and a teleport."
  }
];

function hashString(text) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickFromHash(items, hash, offset = 0) {
  return items[(hash + offset) % items.length];
}

function splitChoices(raw) {
  return raw
    .split(/[,\n|]/)
    .map(option => option.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function formatGp(value) {
  if (!value) return null;
  return `${Number(value).toLocaleString("en-US")} gp`;
}

async function handleProfile(interaction) {
  const user = interaction.options.getUser("user") || interaction.user;
  const hash = hashString(user.id);
  const luck = (hash % 100) + 1;
  const risk = ((hash >> 3) % 100) + 1;
  const discipline = ((hash >> 6) % 100) + 1;

  await interaction.editReply([
    `**${user.username}'s ronin profile**`,
    `Title: **${pickFromHash(profileTitles, hash)}**`,
    `Combat style: **${pickFromHash(combatStyles, hash, 3)}**`,
    `Luck: **${luck}/100** | Risk: **${risk}/100** | Discipline: **${discipline}/100**`,
    `Today's quest: ${pickFromHash(profileQuests, hash, 7)}.`
  ].join("\n"));
}

async function handleMeme(interaction) {
  const topic = interaction.options.getString("topic") || "";
  const style = interaction.options.getString("style") || "random";
  await interaction.editReply(createMemePost(topic, style));
}

async function handleQuote(interaction) {
  const category = interaction.options.getString("category") || "random";
  await interaction.editReply(getRandomQuote(category));
}

async function handleLoot(interaction) {
  const item = interaction.options.getString("item", true);
  const source = interaction.options.getString("source") || "the grind";
  const value = formatGp(interaction.options.getInteger("value"));

  await interaction.editReply(trimForDiscord([
    `**Loot broadcast**`,
    `${interaction.user} received **${item}** from **${source}**.`,
    value ? `Estimated value: **${value}**.` : "",
    randomItem([
      "The clan chat approves.",
      "The bank tab grows heavier.",
      "The ronin marks this as a worthy flex.",
      "Screenshots are spiritually required."
    ])
  ].filter(Boolean).join("\n")));
}

async function handleChoose(interaction) {
  const options = splitChoices(interaction.options.getString("options", true));

  if (options.length < 2) {
    await interaction.editReply("Give me at least two choices, separated by commas. Example: `raid, skill, sleep`.");
    return;
  }

  await interaction.editReply(`The ronin chooses: **${randomItem(options)}**.`);
}

async function handleTimer(interaction) {
  const minutes = interaction.options.getInteger("minutes", true);
  const label = interaction.options.getString("label", true);
  const channel = interaction.channel;

  await interaction.editReply(`Timer set for **${minutes} minute${minutes === 1 ? "" : "s"}**: **${label}**.`);

  if (!channel) return;

  setTimeout(() => {
    channel.send({
      content: `${interaction.user} timer complete: **${label}**.`,
      allowedMentions: { users: [interaction.user.id] }
    }).catch(error => console.error("Timer send failed", error));
  }, minutes * 60 * 1000);
}

async function handleRoast(interaction) {
  const user = interaction.options.getUser("user") || interaction.user;
  await interaction.editReply(`${user}, ${randomItem(roastLines)}`);
}

async function handleCompliment(interaction) {
  const user = interaction.options.getUser("user") || interaction.user;
  await interaction.editReply(`${user}, ${randomItem(complimentLines)}`);
}

async function handleTrivia(interaction) {
  const trivia = randomItem(triviaQuestions);
  await interaction.editReply(`**Trivia:** ${trivia.question}\nAnswer: ||${trivia.answer}||`);
}

export async function handleGameCommand(interaction) {
  if (interaction.commandName === "profile") {
    await handleProfile(interaction);
    return true;
  }

  if (interaction.commandName === "meme") {
    await handleMeme(interaction);
    return true;
  }

  if (interaction.commandName === "quote") {
    await handleQuote(interaction);
    return true;
  }

  if (interaction.commandName === "loot") {
    await handleLoot(interaction);
    return true;
  }

  if (interaction.commandName === "choose") {
    await handleChoose(interaction);
    return true;
  }

  if (interaction.commandName === "timer") {
    await handleTimer(interaction);
    return true;
  }

  if (interaction.commandName === "roast") {
    await handleRoast(interaction);
    return true;
  }

  if (interaction.commandName === "compliment") {
    await handleCompliment(interaction);
    return true;
  }

  if (interaction.commandName === "trivia") {
    await handleTrivia(interaction);
    return true;
  }

  return false;
}

