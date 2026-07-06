import Link from "next/link";

export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col gap-flow-xs sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-fluid-lg uppercase tracking-[0.12em] text-accent">
          {title}
        </h2>
        <div className="mt-flow-2xs h-px w-16 bg-accent/40" aria-hidden="true" />
      </div>
      {action ? (
        <Link
          href={action.href}
          className="link-underline self-start font-label text-fluid-xs uppercase tracking-[0.18em] text-accent sm:self-auto"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
