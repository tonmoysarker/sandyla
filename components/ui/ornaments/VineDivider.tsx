export function VineDivider() {
  return (
    <svg
      data-testid="vine-divider"
      aria-hidden="true"
      viewBox="0 0 200 24"
      className="mx-auto my-8 h-6 w-48 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path d="M0 12 H80" />
      <path d="M120 12 H200" />
      <path d="M100 12 L94 6 L100 0 L106 6 Z" fill="currentColor" stroke="none" />
      <path d="M80 12 C88 4 92 20 100 12" />
      <path d="M120 12 C112 20 108 4 100 12" />
    </svg>
  );
}
