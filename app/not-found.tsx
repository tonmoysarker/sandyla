import Link from "next/link";
import { VineDivider } from "@/components/ui/ornaments/VineDivider";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-flow-s py-flow-xl text-center">
      <p className="font-display text-fluid-3xl text-accent/40">404</p>
      <h1 className="mt-flow-xs font-display text-fluid-xl text-ink">Página Perdida</h1>
      <VineDivider />
      <p className="max-w-md font-body italic text-ink/75">
        Este verso parece ter se perdido entre as sombras. Volte para continuar a leitura.
      </p>
      <Link href="/" className="btn btn-primary mt-flow-l">
        Voltar ao Início
      </Link>
    </main>
  );
}
