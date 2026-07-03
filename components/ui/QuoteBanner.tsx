import { VineDivider } from "@/components/ui/ornaments/VineDivider";

export function QuoteBanner({ quote }: { quote: string }) {
  return (
    <div className="px-6 py-16 text-center">
      <VineDivider />
      <p className="mx-auto max-w-2xl font-display text-fluid-xl italic text-ink">&ldquo;{quote}&rdquo;</p>
    </div>
  );
}
