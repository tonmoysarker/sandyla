/** Quarter-corner Art Nouveau vine, for framing hero imagery and cards. */
export function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      data-testid="corner-flourish"
      aria-hidden="true"
      viewBox="0 0 80 80"
      className={`h-16 w-16 text-accent ${className}`.trim()}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
    >
      <path d="M76 6 C40 8 12 32 8 74" strokeOpacity={0.5} />
      <path d="M76 6 C52 12 30 30 22 56 C19 66 26 72 32 68 C37 64.5 35 57 29 58" />
      <path d="M52 18 C45 26 40 35 37 45" strokeOpacity={0.6} />
      <path d="M56 14 C61 9 68 8 72 12 C68 16.5 61 17 56 14 Z" fill="currentColor" fillOpacity={0.3} stroke="none" />
      <path d="M34 38 C37 32 43 30 47 33 C44 38 38 40 34 38 Z" fill="currentColor" fillOpacity={0.3} stroke="none" />
      <circle cx="10" cy="74" r="1.6" fill="currentColor" stroke="none" fillOpacity={0.6} />
    </svg>
  );
}
