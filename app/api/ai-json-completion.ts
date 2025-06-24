import { OpenAI } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { travelItineraryResponseSchema } from "./schemas";

import { OpenAI as Groq } from "openai";
import { ZodFunctionDef, toTool } from "openai-zod-functions";

const groq = new Groq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CURRENT_AI = process.env.CURRENT_AI ?? "openai";

async function completeGroq(
  system: string,
  userPrompt: string,
  functions: ZodFunctionDef[]
) {
  try {
    const completions = await groq.chat.completions.create({
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      model: "llama3-70b-8192",
      tools: functions.map(toTool),
      temperature: 0.9,
      tool_choice: "auto",
    });

    const firstChoice = completions.choices[0];
    if (!firstChoice?.message?.tool_calls?.length) {
      return [];
    }

    return JSON.parse(firstChoice.message.tool_calls[0].function.arguments);
  } catch (error) {
    console.error("🚨 Its so over 🚨", error);
    return null;
  }
}

async function completeOpenAi(system: string, userPrompt: string) {
  try {
    const { object } = await generateObject({
      model: openai.chat("gpt-4o"), // gpt-3.5-turbo-1106
      schema: travelItineraryResponseSchema,
      mode: "json",
      prompt: userPrompt,
      system: system,
    });

    return object;
  } catch (error) {
    console.error("Error calling AI:", error);
    return null;
  }
}

async function completeAnthropic(system: string, userPrompt: string) {
  try {
    const { object } = await generateObject({
      model: anthropic.chat("claude-3-haiku-20240307"),
      schema: travelItineraryResponseSchema,
      prompt: userPrompt,
      system: system,
    });

    return object;
  } catch (error) {
    console.error("Error calling AI:", error);
    return null;
  }
}

export async function getModelOutput(
  system: string,
  userPrompt: string,
  functions: ZodFunctionDef[]
): Promise<any> {
  switch (CURRENT_AI) {
    case "anthropic":
      return completeAnthropic(system, userPrompt);
    case "groq":
      return completeGroq(system, userPrompt, functions);
    case "openai":
      return completeOpenAi(system, userPrompt);
    default:
      console.error(`Unsupported AI provider: ${CURRENT_AI}`);
      return null;
  }
}
