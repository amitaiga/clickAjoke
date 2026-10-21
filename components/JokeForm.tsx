// Static in M1: no submit handler yet (wired up in M2).
export default function JokeForm() {
  return (
    <div className="flex flex-col gap-5">
      <input
        type="text"
        maxLength={100}
        aria-label="נושא הבדיחה"
        placeholder="על מה הבדיחה? אפשר להשאיר ריק"
        className="h-12 w-full rounded-control border-[3px] border-ink bg-white px-4 text-right text-[16px] text-ink placeholder:text-placeholder-grey focus:outline-4 focus:outline-offset-4 focus:outline-sky-blue"
      />
      <button
        type="button"
        className="h-12 w-full cursor-pointer rounded-control border-[3px] border-ink bg-comic-yellow text-button text-ink shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:border-warm-grey disabled:bg-paper disabled:text-warm-grey disabled:shadow-none"
      >
        ספר לי בדיחה
      </button>
    </div>
  );
}
