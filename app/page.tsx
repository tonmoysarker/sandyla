import { getHomeContent, getAllPoems, getSiteSettings } from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { PoemListItem } from "@/components/poems/PoemListItem";
import { FeaturedPoemCard } from "@/components/poems/FeaturedPoemCard";
import { TeaserCard } from "@/components/home/TeaserCard";
import { QuoteBanner } from "@/components/ui/QuoteBanner";

export default function HomePage() {
  const home = getHomeContent();
  const poems = getAllPoems();
  const settings = getSiteSettings();
  const latestPoems = poems.slice(0, 4);
  const featuredPoem = poems.find((poem) => poem.featured) ?? poems[0];

  return (
    <main>
      <Hero {...home} />

      <section className="grid gap-10 px-6 py-16 md:grid-cols-2 md:px-16">
        <div>
          <h2 className="font-display text-fluid-xl text-accent">Últimos Poemas</h2>
          <ul className="mt-6 space-y-6">
            {latestPoems.map((poem) => (
              <PoemListItem key={poem.slug} poem={poem} />
            ))}
          </ul>
        </div>
        {featuredPoem ? <FeaturedPoemCard poem={featuredPoem} /> : null}
      </section>

      <section className="grid gap-8 px-6 py-16 md:grid-cols-2 md:px-16">
        <TeaserCard
          title="Sobre Mim"
          description="Apaixonada por palavras, natureza e tudo que toca a alma."
          cta={{ label: "Conhecer minha história", href: "/sobre" }}
        />
        <TeaserCard
          title="Portfólio"
          description="Além dos versos, exploro a criatividade em diferentes formas."
          cta={{ label: "Ver portfólio", href: "/portfolio" }}
        />
      </section>

      <QuoteBanner quote={settings.footerQuote} />
    </main>
  );
}
