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
            className={`rounded-full border px-4 py-1.5 font-label text-xs uppercase tracking-wide transition-all duration-organic-fast ease-organic ${
              isActive
                ? "border-gold bg-gold text-obsidian"
                : "border-ink/30 text-ink/70 hover:border-gold hover:text-gold"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
