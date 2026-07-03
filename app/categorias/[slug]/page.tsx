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

  return (
    <main className="mx-auto max-w-content px-flow-s py-flow-xl md:px-flow-l">
      <PageHeader title={category?.label ?? params.slug} subtitle={category?.description} />
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
