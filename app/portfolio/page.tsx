import { getAllProjects } from "@/lib/content";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { FeaturedProjectCard } from "@/components/portfolio/FeaturedProjectCard";

export const metadata = {
  title: "Portfólio | Versos",
  description: "Uma seleção de ilustrações, manuscritos e outras formas de expressão artística.",
};

export default function PortfolioPage() {
  const projects = getAllProjects();
  const featured = projects.find((project) => project.featured);
  const rest = projects.filter((project) => project.slug !== featured?.slug);

  return (
    <main className="px-6 py-12 md:px-16">
      <h1 className="font-display text-3xl text-gold">Portfólio Criativo</h1>
      <p className="mt-2 max-w-xl font-body text-ink/80">
        Uma seleção de ilustrações, manuscritos e outras formas de expressão artística.
      </p>
      {featured ? (
        <div className="mt-8">
          <FeaturedProjectCard project={featured} />
        </div>
      ) : null}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {rest.map((project, index) => (
          <ProjectCard key={project.slug} project={project} variant={index} />
        ))}
      </div>
    </main>
  );
}
