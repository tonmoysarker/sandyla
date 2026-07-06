import Link from "next/link";
import { FlourishIcon } from "@/components/ui/icons";
import { formatDate } from "@/lib/format-date";
import type { Poem } from "@/lib/content";

export function PoemListItem({ poem }: { poem: Poem }) {
  return (
    <li>
      <Link href={`/poemas/${poem.slug}`} className="group flex items-start gap-flow-xs">
        <span className="circle-icon mt-0.5 h-11 w-11 shrink-0 text-secondary/80">
          <FlourishIcon className="h-5 w-5" />
        </span>
        <span>
          <span className="block font-display text-fluid-md text-ink transition-colors duration-organic-fast ease-organic group-hover:text-accent">
            {poem.title}
          </span>
          <span className="mt-1 block font-label text-fluid-xs uppercase tracking-[0.15em] text-ink/50">
            {formatDate(poem.date)}
          </span>
        </span>
      </Link>
    </li>
  );
}
