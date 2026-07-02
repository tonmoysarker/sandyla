export function RoseBullet({ className = "" }: { className?: string }) {
  return (
    <svg
      data-testid="rose-bullet"
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`h-4 w-4 text-emerald ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      <circle cx="8" cy="8" r="3" />
      <path d="M8 5 C6 3 6 1 8 1 C10 1 10 3 8 5" />
      <path d="M8 11 C6 13 6 15 8 15 C10 15 10 13 8 11" />
      <path d="M5 8 C3 6 1 6 1 8 C1 10 3 10 5 8" />
      <path d="M11 8 C13 6 15 6 15 8 C15 10 13 10 11 8" />
    </svg>
  );
}
