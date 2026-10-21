// Notice component from the Style Guide. Only "error" is used in M2; "info" is wired in M3.
type Props = { variant: "error" | "info"; children: React.ReactNode };

export default function Notice({ variant, children }: Props) {
  const colors = variant === "error" ? "bg-comic-red text-white" : "bg-peach text-ink";
  return (
    <p
      className={`rounded-control border-[3px] border-ink px-4 py-3 text-right text-[14px] leading-5 font-bold ${colors}`}
    >
      {children}
    </p>
  );
}
