// "Loading" icon from the Style Guide: white speech bubble with three ink dots.
export default function LoadingBubble() {
  return (
    <div role="status" aria-label="טוען בדיחה" className="flex justify-start py-2">
      <svg viewBox="0 0 56 48" className="h-12 w-14" aria-hidden="true">
        <path
          d="M10 4 H46 A6 6 0 0 1 52 10 V30 A6 6 0 0 1 46 36 H40 L42 45 L31 36 H10 A6 6 0 0 1 4 30 V10 A6 6 0 0 1 10 4 Z"
          fill="#ffffff"
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle className="loading-dot" cx="18" cy="20" r="3.5" fill="var(--color-ink)" />
        <circle className="loading-dot [animation-delay:150ms]" cx="28" cy="20" r="3.5" fill="var(--color-ink)" />
        <circle className="loading-dot [animation-delay:300ms]" cx="38" cy="20" r="3.5" fill="var(--color-ink)" />
      </svg>
    </div>
  );
}
