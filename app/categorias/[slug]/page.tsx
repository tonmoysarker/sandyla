import Link from "next/link";
import { getAllPoems, getCategories } from "@/lib/content";
import { PoemCard } from "@/components/poems/PoemCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export default function CategoriaPage({ params }: { params: { slug: string } }) {
  const categories = getCategories();
  const category = categories.find((c) => c.slug === params.slug);
  const poems = getAllPoems().filter((poem) => poem.category === params.slug);

  const filterOptions = [
    { slug: "todos", label: "Todos", href: "/poemas" },
    ...categories.map((c) => ({ slug: c.slug, label: c.label, href: `/categorias/${c.slug}` })),
  ];

  return (
    <main className="mx-auto max-w-content px-flow-s py-flow-xl md:px-flow-l">
      <PageHeader title={category?.label ?? params.slug} subtitle={category?.description} />
      <div className="mt-flow-m flex flex-wrap justify-center gap-flow-2xs">
        {filterOptions.map((option) => (
          <Link
            key={option.slug}
            href={option.href}
            className={`rounded-full border px-4 py-1.5 font-label text-fluid-xs uppercase tracking-[0.1em] transition-all duration-organic-base ease-organic ${
              option.slug === params.slug
                ? "border-accent bg-accent text-on-accent"
                : "border-outline-variant text-ink/70 hover:border-accent hover:text-accent hover:glow-soft"
            }`}
          >
            {option.label}
          </Link>
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
