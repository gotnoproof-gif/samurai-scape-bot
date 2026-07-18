import { EmbedBuilder } from "discord.js";
import { randomItem, trimForDiscord } from "./utils.js";

const memeStyles = {
  random: ["drake", "twobuttons", "buzz", "both", "disastergirl", "gru", "success"],
  drop: ["drake", "disastergirl", "success"],
  grind: ["buzz", "twobuttons", "gru"],
  boss: ["twobuttons", "both", "drake"],
  bank: ["drake", "success", "buzz"],
  clan: ["both", "buzz", "success"]
};

const memeCopy = {
  drop: [
    ["Finally seeing the drop", "It is another stack of coins"],
    ["Going dry for hours", "Calling it character development"],
    ["The loot table", "Choosing violence today"]
  ],
  grind: [
    ["One more level", "Six hours later"],
    ["Efficient training", "Bankstanding with confidence"],
    ["XP drops appearing", "The clan chat grows stronger"]
  ],
  boss: [
    ["The plan", "Everyone panic eating anyway"],
    ["Clean boss kill", "Somehow still out of supplies"],
    ["Calling a team", "Five warriors, three different worlds"]
  ],
  bank: [
    ["Before gearing", "After gearing"],
    ["Checking bank value", "Pretending supplies are free"],
    ["Grand Exchange flips", "Emotional damage with taxes"]
  ],
  clan: [
    ["Clan chat at midnight", "Peak strategic nonsense"],
    ["One person says raid", "The whole server wakes up"],
    ["The squad arriving", "Late, geared, and loud"]
  ],
  random: [
    ["RuneScape logic", "Makes perfect sense after 300 hours"],
    ["The ronin watching chat", "This belongs in a meme scroll"],
    ["Today in Gielinor", "Chaos, snacks, and questionable decisions"]
  ]
};

function cleanMemeText(text) {
  return text
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/[^\w\s.,!?'-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 70);
}

function encodeMemePathPart(text) {
  const cleaned = cleanMemeText(text) || "RuneScape moment";
  return encodeURIComponent(cleaned.replace(/_/g, " ").replace(/\s+/g, "_"));
}

function normalizeStyle(style) {
  const normalized = (style || "random").toLowerCase();
  return memeStyles[normalized] ? normalized : "random";
}

function pickTemplate(style) {
  return randomItem(memeStyles[normalizeStyle(style)]);
}

function pickMemeLines(topic, style) {
  const normalizedStyle = normalizeStyle(style);
  if (topic) {
    return randomItem([
      [`When the clan starts talking about ${topic}`, "The ronin starts loading the meme cannon"],
      [`Me pretending to understand ${topic}`, "Nods in 2007"],
      [`${topic}`, "Somehow this is now a server event"],
      [`The chat mentioned ${topic}`, "Protect item immediately"]
    ]);
  }

  return randomItem(memeCopy[normalizedStyle] || memeCopy.random);
}

export function createMemePost(topic = "", style = "random") {
  const normalizedStyle = normalizeStyle(style);
  const [top, bottom] = pickMemeLines(cleanMemeText(topic), normalizedStyle);
  const template = pickTemplate(normalizedStyle);
  const url = `https://api.memegen.link/images/${template}/${encodeMemePathPart(top)}/${encodeMemePathPart(bottom)}.png`;

  const embed = new EmbedBuilder()
    .setTitle("Ronin meme scroll")
    .setColor(0xc2410c)
    .setImage(url)
    .setFooter({ text: `style: ${normalizedStyle}` });

  return {
    content: trimForDiscord(randomItem([
      "The ronin unrolls a meme scroll.",
      "A fresh clan meme appears.",
      "The dojo has produced visual evidence."
    ]), 600),
    embeds: [embed]
  };
}

export function memeImageResponderIsEnabled() {
  const value = process.env.MEME_IMAGE_RESPONDER_ENABLED;
  if (value === undefined) return true;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

