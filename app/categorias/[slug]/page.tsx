import { getAllPoems, getCategories } from "@/lib/content";
import { PoemCard } from "@/components/poems/PoemCard";

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export default function CategoriaPage({ params }: { params: { slug: string } }) {
  const categories = getCategories();
  const category = categories.find((c) => c.slug === params.slug);
  const poems = getAllPoems().filter((poem) => poem.category === params.slug);

  return (
    <main className="px-6 py-12 md:px-16">
      <h1 className="font-display text-fluid-2xl text-accent">{category?.label ?? params.slug}</h1>
      <p className="mt-2 max-w-xl font-body text-ink/80">{category?.description}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {poems.map((poem, index) => (
          <PoemCard key={poem.slug} poem={poem} variant={index} />
        ))}
      </div>
    </main>
  );
}
