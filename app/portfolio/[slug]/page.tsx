import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug, getSiteSettings } from "@/lib/content";
import { buildProjectMetadata, buildProjectJsonLd } from "@/lib/seo";
import { DetailPage } from "@/components/templates/DetailPage";
import { formatDate } from "@/lib/format-date";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return buildProjectMetadata(project, getSiteSettings());
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const jsonLd = buildProjectJsonLd(project, getSiteSettings());

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DetailPage title={project.title} eyebrow={project.category} meta={formatDate(project.date)}>
        {project.content.split("\n\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </DetailPage>
    </main>
  );
}
