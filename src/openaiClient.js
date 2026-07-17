import OpenAI from "openai";
import { persona } from "./persona.js";

let openai;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  return openai;
}

export async function askRonin(prompt) {
  const response = await getOpenAI().responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
    reasoning: { effort: "low" },
    instructions: persona,
    input: prompt
  });

  return response.output_text || "The ronin is silent. Try again.";
}
