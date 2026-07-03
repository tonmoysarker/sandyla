import { FlourishIcon } from "@/components/ui/icons";
import type { Poem } from "@/lib/content";

export function FeaturedPoemCard({ poem }: { poem: Poem }) {
  return (
    <div className="group relative overflow-hidden rounded-soft border border-outline-variant bg-surface-low p-flow-l transition-all duration-organic-base ease-organic hover:border-accent/60 hover:glow-soft md:p-flow-xl">
      <span className="font-label text-fluid-xs uppercase tracking-[0.3em] text-secondary">
        Destaque
      </span>
      <h3 className="mt-flow-xs font-display text-fluid-xl leading-tight text-ink">{poem.title}</h3>
      <div className="mt-flow-s h-px w-12 bg-accent/40" aria-hidden="true" />
      <p className="mt-flow-s font-body italic text-ink/75">{poem.excerpt}</p>
      <a href={`/poemas/${poem.slug}`} className="btn btn-primary mt-flow-m">
        Ler poema completo
        <FlourishIcon className="h-4 w-4" />
      </a>
    </div>
  );
}
