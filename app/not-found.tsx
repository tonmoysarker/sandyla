export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl text-gold">Página Perdida</h1>
      <p className="mt-4 max-w-md font-body text-ink/80">
        Este verso parece ter se perdido entre as sombras. Volte para continuar a leitura.
      </p>
      <a href="/" className="mt-8 rounded-soft border border-gold bg-gold px-6 py-3 font-label text-sm uppercase tracking-wide text-obsidian">
        Voltar ao Início
      </a>
    </main>
  );
}
