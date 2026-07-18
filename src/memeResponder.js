import { randomItem, trimForDiscord } from "./utils.js";
import { createMemePost, memeImageResponderIsEnabled } from "./memeImages.js";

const DEFAULT_REPLY_CHANCE = 0.06;
const DEFAULT_KEYWORD_REPLY_CHANCE = 0.22;
const DEFAULT_COOLDOWN_MS = 180000;
const DEFAULT_MIN_MESSAGE_LENGTH = 6;
const DEFAULT_IMAGE_REPLY_CHANCE = 0.35;

const stopWords = new Set([
  "about",
  "after",
  "again",
  "also",
  "because",
  "before",
  "being",
  "could",
  "discord",
  "every",
  "from",
  "have",
  "into",
  "just",
  "like",
  "more",
  "much",
  "need",
  "only",
  "really",
  "should",
  "some",
  "that",
  "their",
  "them",
  "then",
  "there",
  "these",
  "thing",
  "this",
  "those",
  "want",
  "when",
  "where",
  "with",
  "would",
  "your"
]);

const memeRules = [
  {
    keywords: ["drop", "rng", "rare", "dry", "spoon", "loot"],
    replies: [
      "POV: the drop table saw your confidence and selected cabbage.",
      "RNG has entered the dojo. Everyone bow and lower expectations.",
      "Me after one dry streak: clearly the boss has personal beef with me.",
      "The loot beam is real. It is simply training invisibility."
    ]
  },
  {
    keywords: ["boss", "raid", "nex", "toa", "cox", "tob", "jad", "zulrah", "vorkath", "bandos", "corp"],
    replies: [
      "Clan chat: one clean kill. The arena: a documentary about panic eating.",
      "The boss heard the plan and immediately requested a rewrite.",
      "Bring food, prayer, and the ancient art of pretending that was lag.",
      "When the squad says easy boss and everyone quietly checks teleport charges."
    ]
  },
  {
    keywords: ["bank", "gp", "gold", "coins", "broke", "buy", "sell", "ge", "grand exchange"],
    replies: [
      "The bank value says warrior. The cash stack says bronze dagger budget.",
      "Grand Exchange merchant arc detected. May your flips be crispy.",
      "Me opening the bank after gearing once: where did the kingdom go?",
      "Financial advice from the ronin: never ask the cash stack how the raid went."
    ]
  },
  {
    keywords: ["death", "died", "ko", "rip", "grave", "plank", "lag"],
    replies: [
      "A tactical plank has been observed.",
      "That was not a death. That was fast travel with consequences.",
      "The gravestone accepts your offering and your dignity.",
      "Lag claims another warrior. The blade was willing. The server was not."
    ]
  },
  {
    keywords: ["skill", "level", "xp", "grind", "train", "99", "max"],
    replies: [
      "Me promising one more level: accidentally creates a six-hour character arc.",
      "XP gains detected. Social life has been safely banked.",
      "The grind is temporary. The cape flex is forever.",
      "A true samurai clicks the same tree until enlightenment."
    ]
  },
  {
    keywords: ["quest", "clue", "scroll", "diary", "task"],
    replies: [
      "Quest helper says three steps. The inventory says bring the entire bank.",
      "Clue scroll energy: run across the world for 127 coins and emotional growth.",
      "The NPC needs a cabbage, a rope, and your afternoon.",
      "Adventure begins where the required item is still in the bank."
    ]
  },
  {
    keywords: ["food", "shark", "brew", "restore", "prayer", "pot", "potion"],
    replies: [
      "Inventory check: snacks, panic juice, and one teleport of shame.",
      "Prayer potion looking at the boss timer like: I was not built for this.",
      "Eat at 70 HP? No. Eat after seeing the hitsplat? Tradition.",
      "The brew giveth. The stats taketh away."
    ]
  },
  {
    keywords: ["samurai", "ronin", "katana", "blade", "honor"],
    replies: [
      "The blade is sharp, the robes are clean, and the bank pin is remembered.",
      "Ronin code: respect the clan, split the loot, do not skull by accident.",
      "A samurai without prayer points is just a confident civilian.",
      "Honor demands we say good luck before absolutely whiffing the spec."
    ]
  }
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
    .replace(/`{1,3}[^`]*`{1,3}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function topicFromContent(content) {
  const words = cleanContent(content)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(word => word.length >= 4 && !stopWords.has(word));

  if (!words.length) return "that";
  return randomItem(words).slice(0, 36);
}

function findMemeRule(content) {
  const lowerContent = content.toLowerCase();
  return memeRules.find(rule => rule.keywords.some(keyword => lowerContent.includes(keyword)));
}

function genericMeme(content) {
  const topic = topicFromContent(content);

  return randomItem([
    `Me watching **${topic}** become the main quest of clan chat.`,
    `The ronin has inspected **${topic}** and diagnosed it as extremely memeable.`,
    `**${topic}** has entered the chat. Protect item immediately.`,
    `When someone says **${topic}**, the clan brain cell starts a boss timer.`,
    `Live clan reaction to **${topic}**: bankstanding intensifies.`
  ]);
}

function styleFromRule(rule) {
  if (!rule) return "random";
  if (rule.keywords.some(keyword => ["drop", "rng", "rare", "dry", "spoon", "loot"].includes(keyword))) return "drop";
  if (rule.keywords.some(keyword => ["boss", "raid", "nex", "toa", "cox", "tob", "jad"].includes(keyword))) return "boss";
  if (rule.keywords.some(keyword => ["bank", "gp", "gold", "coins", "ge"].includes(keyword))) return "bank";
  if (rule.keywords.some(keyword => ["skill", "level", "xp", "grind", "train"].includes(keyword))) return "grind";
  return "clan";
}

export function memeResponderWantsMessageContent() {
  return getBooleanEnv("MESSAGE_CONTENT_INTENT_ENABLED", false);
}

export function memeResponderIsEnabled() {
  return getBooleanEnv("MEME_RESPONDER_ENABLED", false);
}

export function createMemeResponder() {
  const lastReplyByChannel = new Map();

  return async function handleMemeResponder(message) {
    if (!memeResponderIsEnabled()) return false;
    if (!message.guildId || !message.channelId || !message.content) return false;
    if (message.content.startsWith("/") || message.content.startsWith("!")) return false;

    const cleaned = cleanContent(message.content);
    const minLength = getNumberEnv("MEME_MIN_MESSAGE_LENGTH", DEFAULT_MIN_MESSAGE_LENGTH, 1, 200);
    if (cleaned.length < minLength) return false;

    const cooldownMs = getNumberEnv("MEME_COOLDOWN_MS", DEFAULT_COOLDOWN_MS, 10000, 3600000);
    const lastReplyAt = lastReplyByChannel.get(message.channelId) || 0;
    if (Date.now() - lastReplyAt < cooldownMs) return false;

    const rule = findMemeRule(cleaned);
    const replyChance = getNumberEnv("MEME_REPLY_CHANCE", DEFAULT_REPLY_CHANCE, 0, 1);
    const keywordReplyChance = getNumberEnv(
      "MEME_KEYWORD_REPLY_CHANCE",
      DEFAULT_KEYWORD_REPLY_CHANCE,
      0,
      1
    );

    if (Math.random() > (rule ? keywordReplyChance : replyChance)) {
      return false;
    }

    lastReplyByChannel.set(message.channelId, Date.now());
    const imageReplyChance = getNumberEnv("MEME_IMAGE_REPLY_CHANCE", DEFAULT_IMAGE_REPLY_CHANCE, 0, 1);

    if (memeImageResponderIsEnabled() && Math.random() < imageReplyChance) {
      await message.reply({
        ...createMemePost(topicFromContent(cleaned), styleFromRule(rule)),
        allowedMentions: { parse: [], repliedUser: false }
      });
      return true;
    }

    const content = rule ? randomItem(rule.replies) : genericMeme(cleaned);

    await message.reply({
      content: trimForDiscord(content, 600),
      allowedMentions: { parse: [], repliedUser: false }
    });

    return true;
  };
}
