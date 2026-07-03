import { getSiteSettings } from "@/lib/content";
import { PageHeader } from "@/components/ui/PageHeader";
import { SendIcon } from "@/components/ui/icons";

export const metadata = {
  title: "Contato | Versos",
  description: "Envie uma mensagem ou entre em contato pelas redes sociais.",
};

export default function ContatoPage() {
  const settings = getSiteSettings();

  return (
    <main className="mx-auto max-w-lg px-flow-s py-flow-xl">
      <PageHeader
        title="Contato"
        subtitle="Envie uma mensagem ou entre em contato pelas redes sociais."
      />
      {settings.contactFormEndpoint ? (
        <form action={settings.contactFormEndpoint} method="POST" className="mt-flow-l space-y-flow-m">
          <input type="text" name="name" placeholder="Seu nome" required className="input-line" />
          <input type="email" name="email" placeholder="Seu e-mail" required className="input-line" />
          <textarea
            name="message"
            placeholder="Sua mensagem"
            required
            rows={5}
            className="input-line resize-y"
          />
          <button type="submit" className="btn btn-primary">
            Enviar
            <SendIcon className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <p className="mt-flow-l text-center font-body text-ink/80">
          Escreva para{" "}
          <a href="mailto:contato@versos.example" className="link-underline text-accent">
            contato@versos.example
          </a>
          .
        </p>
      )}
    </main>
  );
}
