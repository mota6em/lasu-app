import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";

// the SDK types predate "none", which is what keeps gpt-5 from thinking first
export const FAST_PARAMS = (
  /^gpt-5/.test(OPENAI_MODEL) ? { reasoning_effort: "none" } : {}
) as { reasoning_effort?: OpenAI.ReasoningEffort };

export const openai = new OpenAI({
  apiKey: apiKey ?? "",
  timeout: 30_000,
  maxRetries: 1,
});

export function hasOpenAIKey() {
  return Boolean(apiKey);
}

export function openAIError(err: unknown): { status: number; message: string } {
  if (err instanceof OpenAI.APIError) {
    if (err.status === 401 || err.status === 403) {
      return { status: 500, message: "Translation is misconfigured. We are on it." };
    }
    if (err.status === 429) {
      return { status: 429, message: "Too many translations right now. Try again in a moment." };
    }
    if (err.status === 400) {
      return { status: 400, message: "That input could not be translated. Try rephrasing it." };
    }
    return { status: 502, message: "Translation failed. Give it another go in a moment." };
  }

  if (err instanceof OpenAI.APIConnectionTimeoutError) {
    return { status: 504, message: "That took too long. Try again." };
  }

  if (err instanceof OpenAI.APIConnectionError) {
    return { status: 503, message: "Could not reach the translator. Check your connection and retry." };
  }

  return { status: 502, message: "Translation failed. Give it another go in a moment." };
}
