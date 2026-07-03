import { VineDivider } from "@/components/ui/ornaments/VineDivider";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mx-auto max-w-2xl text-center">
      <h1 className="font-display text-fluid-2xl text-ink">{title}</h1>
      <VineDivider />
      {subtitle ? <p className="font-body text-fluid-md italic text-ink/70">{subtitle}</p> : null}
    </header>
  );
}
