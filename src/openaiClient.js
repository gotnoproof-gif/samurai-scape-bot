import OpenAI from "openai";
import { persona } from "./persona.js";

let openai;

function fallbackRoninReply(prompt) {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("skill") || lowerPrompt.includes("train")) {
    return "My AI scroll is out of charges, but the old ways remain: pick one skill, set a small goal, bank supplies first, and train until the level-up spark appears.";
  }

  if (lowerPrompt.includes("gear") || lowerPrompt.includes("boss") || lowerPrompt.includes("fight")) {
    return "My AI scroll is out of charges, warrior. Bring food, a teleport, prayer potions if needed, and gear you can afford to lose. A living ronin can always regear.";
  }

  if (lowerPrompt.includes("samrai") || lowerPrompt.includes("samurai") || lowerPrompt.includes("ronin")) {
    return "I hear you. The AI spirit is out of charges right now, but this ronin still stands watch over Gielinor.";
  }

  return "The AI spirit is out of charges right now, but I hear you. Ask me with `/quest`, `/clanquote`, or try again after the OpenAI billing scroll is restored.";
}

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  return openai;
}

export async function askRonin(prompt) {
  try {
    const response = await getOpenAI().responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      reasoning: { effort: "low" },
      instructions: persona,
      input: prompt
    });

    return response.output_text || "The ronin is silent. Try again.";
  } catch (error) {
    console.error("OpenAI request failed", {
      code: error.code,
      status: error.status,
      type: error.type,
      message: error.message
    });

    return fallbackRoninReply(prompt);
  }
}
