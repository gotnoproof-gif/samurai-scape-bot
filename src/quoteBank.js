import { randomItem } from "./utils.js";

const quoteBank = {
  samurai: [
    { text: "Think lightly of yourself and deeply of the world.", by: "Miyamoto Musashi" },
    { text: "The way is in training.", by: "Miyamoto Musashi" },
    { text: "Fall seven times, stand up eight.", by: "Japanese proverb" },
    { text: "Discipline is the bridge between intent and victory.", by: "Ronin code" }
  ],
  famous: [
    { text: "Well done is better than well said.", by: "Benjamin Franklin" },
    { text: "Fortune favors the bold.", by: "Latin proverb" },
    { text: "Know thyself.", by: "Ancient Greek maxim" },
    { text: "No great thing is created suddenly.", by: "Epictetus" }
  ],
  runescape: [
    { text: "Bank first. Regret later.", by: "Gielinor street wisdom" },
    { text: "A teleport tab is just confidence with an exit plan.", by: "Clan proverb" },
    { text: "The grind is long, but the cape remembers.", by: "Ronin of Gielinor" },
    { text: "Never trust a boss room without checking your prayer points.", by: "Veteran advice" }
  ],
  clan: [
    { text: "Split the loot, share the laughs, keep the blade sharp.", by: "Clan code" },
    { text: "A quiet inventory becomes a loud story.", by: "Clan chat" },
    { text: "The best drop is the run everyone remembers.", by: "Raid hall wall" },
    { text: "If the plan survives contact, the boss was too easy.", by: "Officer note" }
  ]
};

function normalizeCategory(category) {
  const normalized = (category || "random").toLowerCase();
  return quoteBank[normalized] ? normalized : "random";
}

export function getRandomQuote(category = "random") {
  const normalized = normalizeCategory(category);
  const quote = normalized === "random"
    ? randomItem(Object.values(quoteBank).flat())
    : randomItem(quoteBank[normalized]);

  return `"${quote.text}" - ${quote.by}`;
}

