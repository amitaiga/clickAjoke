import Header from "@/components/Header";
import JokeForm from "@/components/JokeForm";

export default function Home() {
  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <main className="mx-auto flex min-h-0 w-full max-w-[480px] flex-1 flex-col px-4">
        {/* Fixed top area: form (and notices from M2) */}
        <div className="shrink-0 pt-6 pb-5">
          <JokeForm />
        </div>
        {/* Only the joke list scrolls (filled in M2) */}
        <section
          aria-live="polite"
          aria-label="רשימת הבדיחות"
          className="min-h-0 flex-1 overflow-y-auto pb-4"
        />
      </main>
    </div>
  );
}
