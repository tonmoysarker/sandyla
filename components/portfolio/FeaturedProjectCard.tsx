import { FlourishIcon } from "@/components/ui/icons";
import type { Project } from "@/lib/content";

export function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <div className="group grid gap-flow-m overflow-hidden rounded-soft border border-outline-variant bg-surface-low p-flow-l transition-all duration-organic-base ease-organic hover:border-accent/60 hover:glow-soft md:grid-cols-2 md:items-center">
      <div className="overflow-hidden rounded-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt=""
          className="h-full w-full object-cover transition-transform duration-organic-slow ease-organic group-hover:scale-[1.03]"
        />
      </div>
      <div>
        <span className="font-label text-fluid-xs uppercase tracking-[0.3em] text-secondary">
          Projeto em Destaque
        </span>
        <h3 className="mt-flow-xs font-display text-fluid-xl leading-tight text-ink">
          {project.title}
        </h3>
        <div className="mt-flow-s h-px w-12 bg-accent/40" aria-hidden="true" />
        <p className="mt-flow-s font-body italic text-ink/75">{project.excerpt}</p>
        <a href={`/portfolio/${project.slug}`} className="btn btn-primary mt-flow-m">
          Ver projeto completo
          <FlourishIcon className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
