import { getSiteSettings } from "@/lib/content";

export const metadata = {
  title: "Contato | Versos",
  description: "Envie uma mensagem ou entre em contato pelas redes sociais.",
};

export default function ContatoPage() {
  const settings = getSiteSettings();

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display text-3xl text-gold">Contato</h1>
      <p className="mt-2 font-body text-ink/80">Envie uma mensagem ou entre em contato pelas redes sociais.</p>
      {settings.contactFormEndpoint ? (
        <form action={settings.contactFormEndpoint} method="POST" className="mt-8 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Seu nome"
            required
            className="w-full rounded-soft border border-ink/30 bg-obsidian-low px-4 py-2 text-ink"
          />
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            required
            className="w-full rounded-soft border border-ink/30 bg-obsidian-low px-4 py-2 text-ink"
          />
          <textarea
            name="message"
            placeholder="Sua mensagem"
            required
            rows={5}
            className="w-full rounded-soft border border-ink/30 bg-obsidian-low px-4 py-2 text-ink"
          />
          <button type="submit" className="rounded-soft border border-gold bg-gold px-6 py-3 font-label text-sm uppercase tracking-wide text-obsidian">
            Enviar
          </button>
        </form>
      ) : (
        <p className="mt-8 font-body text-ink/80">
          Escreva para{" "}
          <a href="mailto:contato@versos.example" className="text-gold underline">
            contato@versos.example
          </a>
          .
        </p>
      )}
    </main>
  );
}
