import { createOpenAI } from "@ai-sdk/openai";

// Default client using environment variable (for backward compatibility)
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Factory function to create OpenAI client with custom API key
export function createOpenAIClient(apiKey?: string) {
  if (apiKey) {
    return createOpenAI({ apiKey });
  }
  return openai;
}

export const DEFAULT_MODEL = "gpt-4o-mini-2024-07-18";
