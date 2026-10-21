"use client";

import { useEffect, useRef, useState } from "react";
import JokeCard from "@/components/JokeCard";
import JokeForm from "@/components/JokeForm";
import LoadingBubble from "@/components/LoadingBubble";
import Notice from "@/components/Notice";
import type { JokeResponse } from "@/lib/joke/types";

type Joke = { id: string; text: string };

const ERROR_MESSAGE = "משהו השתבש, נסו שוב";

// Retries once only when no response arrived at all (e.g. offline).
// Server error responses are not retried: the server already retried.
async function postTopic(topic: string): Promise<Response> {
  const send = () =>
    fetch("/api/joke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
  try {
    return await send();
  } catch {
    return await send();
  }
}

export default function JokeApp() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const listRef = useRef<HTMLElement>(null);

  // Keep the newest joke (or the loading bubble) in view.
  useEffect(() => {
    if (!loading && jokes.length === 0) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const list = listRef.current;
    list?.scrollTo({ top: list.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [jokes.length, loading]);

  async function requestJoke() {
    if (loading) return;
    setError(false);
    setLoading(true);
    try {
      const response = await postTopic(topic);
      const data = (await response.json()) as JokeResponse;
      if (response.ok && "status" in data) {
        if (data.status === "ok") {
          setJokes((list) => [...list, { id: crypto.randomUUID(), text: data.joke }]);
        }
        // "blocked": no card; the info notice arrives in M3.
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-[480px] flex-1 flex-col px-4">
      {/* Fixed top area: form and notices */}
      <div className="flex shrink-0 flex-col gap-5 pt-6 pb-5">
        <JokeForm topic={topic} loading={loading} onTopicChange={setTopic} onSubmit={requestJoke} />
        <div aria-live="polite">{error && <Notice variant="error">{ERROR_MESSAGE}</Notice>}</div>
      </div>
      {/* Only the joke list scrolls */}
      <section
        ref={listRef}
        aria-live="polite"
        aria-label="רשימת הבדיחות"
        className="min-h-0 flex-1 overflow-y-auto pb-4"
      >
        <div className="flex flex-col gap-12 pe-1 pb-8">
          {jokes.map((joke) => (
            <JokeCard key={joke.id} text={joke.text} />
          ))}
          {loading && <LoadingBubble />}
        </div>
      </section>
    </main>
  );
}
