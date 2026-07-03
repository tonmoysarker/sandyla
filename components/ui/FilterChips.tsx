"use client";

type Option = { slug: string; label: string };

export function FilterChips({
  options,
  activeSlug,
  onSelect,
}: {
  options: Option[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isActive = option.slug === activeSlug;
        return (
          <button
            key={option.slug}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option.slug)}
            className={`rounded-full border px-4 py-1.5 font-label text-fluid-xs uppercase tracking-[0.1em] transition-all duration-organic-base ease-organic ${
              isActive
                ? "border-accent bg-accent text-on-accent"
                : "border-outline-variant text-ink/70 hover:border-accent hover:text-accent hover:glow-soft"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
