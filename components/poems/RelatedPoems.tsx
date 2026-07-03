import { PoemCard } from "@/components/poems/PoemCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Poem } from "@/lib/content";

export function RelatedPoems({ poems }: { poems: Poem[] }) {
  if (poems.length === 0) return null;

  return (
    <section className="mt-flow-xl border-t border-outline-variant/40 pt-flow-xl">
      <SectionHeader title="Outros Sussurros" />
      <div className="mt-flow-l grid gap-flow-m md:grid-cols-3">
        {poems.map((poem, index) => (
          <PoemCard key={poem.slug} poem={poem} variant={index} />
        ))}
      </div>
    </section>
  );
}
