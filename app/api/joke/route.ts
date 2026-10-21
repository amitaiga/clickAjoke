import { generateJoke } from "@/lib/joke/ai";
import type { JokeResponse } from "@/lib/joke/types";
import { parseTopic } from "@/lib/joke/validation";

export const maxDuration = 60;

const MAX_BODY_BYTES = 1024;

function reply(body: JokeResponse, status = 200) {
  return Response.json(body, { status });
}

const badRequest = () => reply({ code: "BAD_REQUEST" }, 400);

// The Origin header must match the host this app is served from.
function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return badRequest();

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return badRequest();

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return badRequest();
  }

  const topic = parseTopic(body);
  if (topic === null) return badRequest();

  try {
    return reply(await generateJoke(topic));
  } catch {
    return reply({ code: "UNAVAILABLE" }, 503);
  }
}
