import type { Project } from "@/lib/content";

export function ProjectCard({ project, variant = 0 }: { project: Project; variant?: number }) {
  const isTall = variant % 3 === 1;

  return (
    <article className="group overflow-hidden rounded-soft border border-outline-variant bg-surface-low transition-all duration-organic-base ease-organic hover:border-accent hover:shadow-[0_0_24px_rgb(var(--accent)/0.15)]">
      <div className="h-1 bg-gradient-to-r from-secondary via-accent to-secondary" aria-hidden="true" />
      <div className={isTall ? "aspect-[3/4]" : "aspect-[4/3]"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.coverImage} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <span className="font-label text-fluid-xs uppercase tracking-wide text-secondary">{project.category}</span>
        <h3 className="mt-2 font-display text-fluid-md text-ink">
          <a href={`/portfolio/${project.slug}`} className="transition-colors duration-organic-fast ease-organic group-hover:text-accent">
            {project.title}
          </a>
        </h3>
        <p className="mt-2 line-clamp-3 font-body text-fluid-sm text-ink/80">{project.excerpt}</p>
        <a href={`/portfolio/${project.slug}`} className="mt-4 inline-block font-label text-fluid-xs text-accent hover:text-secondary">
          Ver projeto
        </a>
      </div>
    </article>
  );
}
