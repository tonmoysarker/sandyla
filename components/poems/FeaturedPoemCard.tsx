import type { Poem } from "@/lib/content";

export function FeaturedPoemCard({ poem }: { poem: Poem }) {
  return (
    <div className="relative overflow-hidden rounded-soft border border-gold-container/40 bg-obsidian-low p-8">
      <span className="font-label text-xs uppercase tracking-widest text-emerald">Destaque</span>
      <h3 className="mt-2 font-display text-2xl text-ink">{poem.title}</h3>
      <p className="mt-4 font-body text-ink/80">{poem.excerpt}</p>
      <a
        href={`/poemas/${poem.slug}`}
        className="mt-6 inline-block font-label text-sm uppercase tracking-wide text-gold transition-colors duration-organic-fast ease-organic hover:text-emerald"
      >
        Ler poema completo
      </a>
    </div>
  );
}
