import { notFound } from "next/navigation";
import { getAllPoems, getPoemBySlug, getRelatedPoems, getSiteSettings } from "@/lib/content";
import { buildPoemMetadata, buildPoemJsonLd } from "@/lib/seo";
import { DetailPage } from "@/components/templates/DetailPage";
import { RelatedPoems } from "@/components/poems/RelatedPoems";
import { GiscusComments } from "@/components/comments/GiscusComments";

export function generateStaticParams() {
  return getAllPoems().map((poem) => ({ slug: poem.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const poem = getPoemBySlug(params.slug);
  if (!poem) return {};
  return buildPoemMetadata(poem, getSiteSettings());
}

export default function PoemDetailPage({ params }: { params: { slug: string } }) {
  const poem = getPoemBySlug(params.slug);
  if (!poem) notFound();

  const settings = getSiteSettings();
  const related = getRelatedPoems(poem, getAllPoems(), 3);
  const jsonLd = buildPoemJsonLd(poem, settings);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DetailPage title={poem.title} meta={`${poem.date} · ${poem.readingTime} min de leitura`}>
        {poem.content.split("\n\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </DetailPage>
      <div className="mx-auto max-w-2xl px-6">
        <RelatedPoems poems={related} />
        <section className="mt-16">
          <h2 className="font-display text-xl text-gold">Reflexões</h2>
          <GiscusComments repo={settings.giscus.repo} category={settings.giscus.category} />
        </section>
      </div>
    </main>
  );
}
