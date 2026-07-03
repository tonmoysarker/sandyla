import { VineDivider } from "@/components/ui/ornaments/VineDivider";
import { FlourishIcon } from "@/components/ui/icons";

export function QuoteBanner({ quote }: { quote: string }) {
  return (
    <div className="px-flow-s py-flow-2xl text-center">
      <FlourishIcon className="mx-auto h-10 w-10 text-accent/60" />
      <p className="mx-auto mt-flow-m max-w-2xl font-display text-fluid-xl italic leading-snug text-ink">
        &ldquo;{quote}&rdquo;
      </p>
      <VineDivider />
    </div>
  );
}
