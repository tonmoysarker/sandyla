import type { Project } from "@/lib/content";

export function ProjectCard({ project, variant = 0 }: { project: Project; variant?: number }) {
  const isTall = variant % 3 === 1;

  return (
    <article className="group overflow-hidden rounded-soft border border-outline-variant bg-surface-low transition-all duration-organic-base ease-organic hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_8px_32px_rgb(var(--glow)/0.14)]">
      <div className="h-1 bg-gradient-to-r from-secondary via-accent to-secondary opacity-70 transition-opacity duration-organic-base ease-organic group-hover:opacity-100" aria-hidden="true" />
      <div className={`overflow-hidden ${isTall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt=""
          className="h-full w-full object-cover transition-transform duration-organic-slow ease-organic group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-flow-s">
        <span className="font-label text-fluid-xs uppercase tracking-[0.15em] text-secondary">
          {project.category}
        </span>
        <h3 className="mt-flow-2xs font-display text-fluid-md text-ink">
          <a
            href={`/portfolio/${project.slug}`}
            className="transition-colors duration-organic-fast ease-organic group-hover:text-accent"
          >
            {project.title}
          </a>
        </h3>
        <p className="mt-flow-2xs line-clamp-3 font-body text-fluid-sm text-ink/75">
          {project.excerpt}
        </p>
        <a
          href={`/portfolio/${project.slug}`}
          className="link-underline mt-flow-s inline-block font-label text-fluid-xs uppercase tracking-[0.1em] text-accent"
        >
          Ver projeto
        </a>
      </div>
    </article>
  );
}
