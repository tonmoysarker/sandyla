import { VineDivider } from "@/components/ui/ornaments/VineDivider";
import { FlourishIcon } from "@/components/ui/icons";
import { ReadingProgress } from "@/components/ui/ReadingProgress";

export function DetailPage({
  title,
  meta,
  eyebrow,
  children,
}: {
  title: string;
  meta: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-prose px-flow-s py-flow-xl">
      <ReadingProgress />
      <header className="text-center">
        {eyebrow ? (
          <p className="font-label text-fluid-xs uppercase tracking-[0.3em] text-secondary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-flow-xs font-display text-fluid-2xl text-ink">{title}</h1>
        <VineDivider />
        <p className="font-label text-fluid-xs uppercase tracking-[0.2em] text-ink/55">{meta}</p>
      </header>
      <div className="drop-cap mt-flow-l space-y-flow-m font-body text-fluid-base leading-[1.8] text-ink/90">
        {children}
      </div>
      <footer className="mt-flow-xl text-center" aria-hidden="true">
        <FlourishIcon className="mx-auto h-8 w-8 text-accent/50" />
      </footer>
    </article>
  );
}
