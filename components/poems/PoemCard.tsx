import type { Poem } from "@/lib/content";

export function PoemCard({ poem, variant = 0 }: { poem: Poem; variant?: number }) {
  const isTall = variant % 3 === 1;

  return (
    <article className="group overflow-hidden rounded-soft border border-gold-container/30 bg-obsidian-low transition-all duration-organic-base ease-organic hover:border-gold hover:shadow-[0_0_24px_rgba(242,202,80,0.15)]">
      <div className="h-1 bg-gradient-to-r from-gold via-emerald to-gold" aria-hidden="true" />
      <div className={isTall ? "aspect-[3/4]" : "aspect-[4/3]"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poem.coverImage} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <span className="font-label text-xs uppercase tracking-wide text-emerald">{poem.category}</span>
        <h3 className="mt-2 font-display text-lg text-ink">
          <a href={`/poemas/${poem.slug}`} className="transition-colors duration-organic-fast ease-organic group-hover:text-gold">
            {poem.title}
          </a>
        </h3>
        <p className="mt-2 line-clamp-3 font-body text-sm text-ink/80">{poem.excerpt}</p>
        <div className="mt-4 flex items-center justify-between font-label text-xs text-ink/60">
          <span>{poem.readingTime} min de leitura</span>
          <a href={`/poemas/${poem.slug}`} className="text-gold hover:text-emerald">
            Ler mais
          </a>
        </div>
      </div>
    </article>
  );
}
