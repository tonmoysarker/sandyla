import { RoseBullet } from "@/components/ui/ornaments/RoseBullet";
import type { Poem } from "@/lib/content";

function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PoemListItem({ poem }: { poem: Poem }) {
  return (
    <li className="flex items-start gap-3">
      <RoseBullet className="mt-1 shrink-0" />
      <a href={`/poemas/${poem.slug}`} className="group">
        <span className="block font-display text-fluid-md text-ink transition-colors duration-organic-fast ease-organic group-hover:text-accent">
          {poem.title}
        </span>
        <span className="block font-label text-fluid-xs uppercase tracking-wide text-ink/60">
          {formatDate(poem.date)}
        </span>
      </a>
    </li>
  );
}
