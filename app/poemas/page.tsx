import { getAllPoems, getCategories } from "@/lib/content";
import { PoemCard } from "@/components/poems/PoemCard";
import { SearchBar } from "@/components/search/SearchBar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "Poemas | Versos",
  description: "Uma coleção de versos moldados em sombras, luz e todo o sentimento que existe entre elas.",
};

export default function PoemasPage() {
  const poems = getAllPoems();
  const categories = getCategories();

  const filterOptions = [
    { slug: "todos", label: "Todos", href: "/poemas" },
    ...categories.map((c) => ({ slug: c.slug, label: c.label, href: `/categorias/${c.slug}` })),
  ];

  return (
    <main className="mx-auto max-w-content px-flow-s py-flow-xl md:px-flow-l">
      <PageHeader
        title="Poemas"
        subtitle="Uma coleção de versos moldados em sombras, luz e todo o sentimento que existe entre elas."
      />
      <div className="mx-auto mt-flow-l max-w-md">
        <SearchBar />
      </div>
      <div className="mt-flow-m flex flex-wrap justify-center gap-flow-2xs">
        {filterOptions.map((option) => (
          <a
            key={option.slug}
            href={option.href}
            className={`rounded-full border px-4 py-1.5 font-label text-fluid-xs uppercase tracking-[0.1em] transition-all duration-organic-base ease-organic ${
              option.slug === "todos"
                ? "border-accent bg-accent text-on-accent"
                : "border-outline-variant text-ink/70 hover:border-accent hover:text-accent hover:glow-soft"
            }`}
          >
            {option.label}
          </a>
        ))}
      </div>
      <Reveal className="mt-flow-xl">
        <div className="grid gap-flow-m md:grid-cols-3">
          {poems.map((poem, index) => (
            <PoemCard key={poem.slug} poem={poem} variant={index} />
          ))}
        </div>
      </Reveal>
    </main>
  );
}
