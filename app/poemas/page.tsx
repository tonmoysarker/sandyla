import { getAllPoems, getCategories } from "@/lib/content";
import { PoemCard } from "@/components/poems/PoemCard";
import { SearchBar } from "@/components/search/SearchBar";

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
    <main className="px-6 py-12 md:px-16">
      <h1 className="font-display text-fluid-2xl text-accent">Poemas</h1>
      <p className="mt-2 max-w-xl font-body text-ink/80">
        Uma coleção de versos moldados em sombras, luz e todo o sentimento que existe entre elas.
      </p>
      <div className="mt-6 max-w-md">
        <SearchBar />
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {filterOptions.map((option) => (
          <a
            key={option.slug}
            href={option.href}
            className={`rounded-full border px-4 py-1.5 font-label text-fluid-xs uppercase tracking-wide ${
              option.slug === "todos"
                ? "border-accent bg-accent text-on-accent"
                : "border-ink/30 text-ink/70 hover:border-accent hover:text-accent"
            }`}
          >
            {option.label}
          </a>
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {poems.map((poem, index) => (
          <PoemCard key={poem.slug} poem={poem} variant={index} />
        ))}
      </div>
    </main>
  );
}
