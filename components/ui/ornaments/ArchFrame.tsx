const archRadius = { borderRadius: "50% 50% 0 0 / 38% 38% 0 0" } as const;

/** Cathedral-arch frame: double border with a keystone diamond at the apex. */
export function ArchFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        className="border border-accent-strong/70 p-2 transition-shadow duration-organic-slow ease-organic hover:glow-soft"
        style={{ ...archRadius, aspectRatio: "3 / 4" }}
      >
        <div className="h-full w-full overflow-hidden border border-outline-variant" style={archRadius}>
          {children}
        </div>
      </div>
      {/* keystone */}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 text-accent"
        fill="currentColor"
      >
        <path d="M8 0 L14 8 L8 16 L2 8 Z" />
        <path d="M8 4 L11 8 L8 12 L5 8 Z" fill="rgb(var(--surface))" />
      </svg>
    </div>
  );
}
