import { z } from "zod";

export const MAX_TOPIC_LENGTH = 100;

const requestSchema = z.object({
  topic: z.string().optional(),
});

// Returns the trimmed topic ("" = no topic), or null when the input is invalid.
export function parseTopic(body: unknown): string | null {
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return null;
  const topic = (parsed.data.topic ?? "").trim();
  if (topic.length > MAX_TOPIC_LENGTH) return null;
  return topic;
}
