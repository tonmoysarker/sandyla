import type { Poem } from "@/lib/content";

export function FeaturedPoemCard({ poem }: { poem: Poem }) {
  return (
    <div className="relative overflow-hidden rounded-soft border border-outline-variant bg-surface-low p-8">
      <span className="font-label text-fluid-xs uppercase tracking-widest text-secondary">Destaque</span>
      <h3 className="mt-2 font-display text-fluid-xl text-ink">{poem.title}</h3>
      <p className="mt-4 font-body text-ink/80">{poem.excerpt}</p>
      <a
        href={`/poemas/${poem.slug}`}
        className="mt-6 inline-block font-label text-fluid-sm uppercase tracking-wide text-accent transition-colors duration-organic-fast ease-organic hover:text-secondary"
      >
        Ler poema completo
      </a>
    </div>
  );
}
