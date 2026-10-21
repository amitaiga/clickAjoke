import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { pickGeneralTopic, SYSTEM_PROMPT } from "./prompt";
import type { JokeResult } from "./types";

const ATTEMPTS = 2;
const TIMEOUT_MS = 20_000;

// Strict structured output requires every field; joke is "" when blocked.
const outputSchema = z.object({
  status: z.enum(["ok", "blocked"]),
  joke: z.string(),
});

let client: OpenAI | null = null;
function getClient() {
  // Retries are handled below so the total stays under maxDuration.
  client ??= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: TIMEOUT_MS,
    maxRetries: 0,
  });
  return client;
}

async function requestJoke(topic: string): Promise<JokeResult> {
  const response = await getClient().responses.parse({
    model: process.env.OPENAI_MODEL ?? "",
    instructions: SYSTEM_PROMPT,
    input: [{ role: "user", content: `Topic: ${topic}` }],
    text: {
      format: zodTextFormat(outputSchema, "joke_result"),
      verbosity: "low",
    },
    reasoning: { effort: "minimal" },
    max_output_tokens: 800,
    store: false,
  });

  if (response.status === "incomplete") throw new Error("incomplete");
  const parsed = outputSchema.safeParse(response.output_parsed);
  if (!parsed.success) throw new Error("invalid output");

  if (parsed.data.status === "blocked") return { status: "blocked" };
  const joke = parsed.data.joke.trim();
  if (!joke) throw new Error("empty joke");
  return { status: "ok", joke };
}

// Throws after all attempts fail; the caller maps that to 503.
export async function generateJoke(topic: string): Promise<JokeResult> {
  const subject = topic || pickGeneralTopic();
  let lastError: unknown;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      return await requestJoke(subject);
    } catch (error) {
      lastError = error;
      // Log only the failure kind, never the topic or the joke.
      const kind =
        error instanceof OpenAI.APIError
          ? `status ${error.status ?? "none"} ${error.name}`
          : error instanceof Error
            ? error.message
            : "unknown";
      console.error(`[api/joke] attempt ${attempt} failed: ${kind}`);
    }
  }
  throw lastError;
}
