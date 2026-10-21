// Speech-bubble card; the share button is added in M4.
export default function JokeCard({ text }: { text: string }) {
  return (
    <article className="relative rounded-card border-[3px] border-ink bg-white p-[18px] shadow-hard">
      <p className="text-body whitespace-pre-line text-right text-ink">{text}</p>
      {/* Bubble tail at the bottom-right corner, outside the card body */}
      <svg
        aria-hidden="true"
        viewBox="0 0 36 28"
        className="absolute -bottom-[25px] right-8 h-7 w-9"
      >
        <path d="M2 0 L18 25 L32 0" fill="#ffffff" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    </article>
  );
}
