import { PoemCard } from "@/components/poems/PoemCard";
import type { Poem } from "@/lib/content";

export function RelatedPoems({ poems }: { poems: Poem[] }) {
  if (poems.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-fluid-lg text-accent">Outros Sussurros</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {poems.map((poem, index) => (
          <PoemCard key={poem.slug} poem={poem} variant={index} />
        ))}
      </div>
    </section>
  );
}
