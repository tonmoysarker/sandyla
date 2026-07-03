import type { Poem } from "@/lib/content";

export function PoemCard({ poem, variant = 0 }: { poem: Poem; variant?: number }) {
  const isTall = variant % 3 === 1;

  return (
    <article className="group overflow-hidden rounded-soft border border-outline-variant bg-surface-low transition-all duration-organic-base ease-organic hover:border-accent hover:shadow-[0_0_24px_rgb(var(--accent)/0.15)]">
      <div className="h-1 bg-gradient-to-r from-accent via-secondary to-accent" aria-hidden="true" />
      <div className={isTall ? "aspect-[3/4]" : "aspect-[4/3]"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poem.coverImage} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <span className="font-label text-fluid-xs uppercase tracking-wide text-secondary">{poem.category}</span>
        <h3 className="mt-2 font-display text-fluid-md text-ink">
          <a href={`/poemas/${poem.slug}`} className="transition-colors duration-organic-fast ease-organic group-hover:text-accent">
            {poem.title}
          </a>
        </h3>
        <p className="mt-2 line-clamp-3 font-body text-fluid-sm text-ink/80">{poem.excerpt}</p>
        <div className="mt-4 flex items-center justify-between font-label text-fluid-xs text-ink/60">
          <span>{poem.readingTime} min de leitura</span>
          <a href={`/poemas/${poem.slug}`} className="text-accent hover:text-secondary">
            Ler mais
          </a>
        </div>
      </div>
    </article>
  );
}
