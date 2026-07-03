import { getAllProjects } from "@/lib/content";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { FeaturedProjectCard } from "@/components/portfolio/FeaturedProjectCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "Portfólio | Versos",
  description: "Uma seleção de ilustrações, manuscritos e outras formas de expressão artística.",
};

export default function PortfolioPage() {
  const projects = getAllProjects();
  const featured = projects.find((project) => project.featured);
  const rest = projects.filter((project) => project.slug !== featured?.slug);

  return (
    <main className="mx-auto max-w-content px-flow-s py-flow-xl md:px-flow-l">
      <PageHeader
        title="Portfólio Criativo"
        subtitle="Uma seleção de ilustrações, manuscritos e outras formas de expressão artística."
      />
      {featured ? (
        <Reveal className="mt-flow-xl">
          <FeaturedProjectCard project={featured} />
        </Reveal>
      ) : null}
      <Reveal className="mt-flow-l">
        <div className="grid gap-flow-m md:grid-cols-3">
          {rest.map((project, index) => (
            <ProjectCard key={project.slug} project={project} variant={index} />
          ))}
        </div>
      </Reveal>
    </main>
  );
}
