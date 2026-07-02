import type { Project } from "@/lib/content";

export function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <div className="grid gap-6 rounded-soft border border-gold-container/40 bg-obsidian-low p-8 md:grid-cols-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={project.coverImage} alt="" className="h-full w-full rounded-soft object-cover" />
      <div>
        <span className="font-label text-xs uppercase tracking-widest text-emerald">Projeto em Destaque</span>
        <h3 className="mt-2 font-display text-2xl text-ink">{project.title}</h3>
        <p className="mt-4 font-body text-ink/80">{project.excerpt}</p>
        <a href={`/portfolio/${project.slug}`} className="mt-6 inline-block font-label text-sm uppercase tracking-wide text-gold hover:text-emerald">
          Ver projeto completo
        </a>
      </div>
    </div>
  );
}
