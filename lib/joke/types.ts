// Shared response shapes of POST /api/joke (see spec/ARCHITECTURE.md 2.b)
export type JokeResponse =
  | { status: "ok"; joke: string }
  | { status: "blocked" }
  | { code: "BAD_REQUEST" | "UNAVAILABLE" };

export type JokeResult = { status: "ok"; joke: string } | { status: "blocked" };
