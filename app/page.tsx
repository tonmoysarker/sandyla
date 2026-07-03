import { getHomeContent, getAllPoems, getSiteSettings } from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { PoemListItem } from "@/components/poems/PoemListItem";
import { FeaturedPoemCard } from "@/components/poems/FeaturedPoemCard";
import { TeaserCard } from "@/components/home/TeaserCard";
import { QuoteBanner } from "@/components/ui/QuoteBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

export default function HomePage() {
  const home = getHomeContent();
  const poems = getAllPoems();
  const settings = getSiteSettings();
  const latestPoems = poems.slice(0, 4);
  const featuredPoem = poems.find((poem) => poem.featured) ?? poems[0];

  return (
    <main>
      <Hero {...home} />

      <section className="mx-auto max-w-content px-flow-s py-flow-2xl md:px-flow-l">
        <Reveal>
          <SectionHeader
            title="Últimos Poemas"
            action={{ label: "Ver todos os poemas", href: "/poemas" }}
          />
        </Reveal>
        <div className="mt-flow-l grid gap-flow-l md:grid-cols-2">
          <Reveal>
            <ul className="space-y-flow-m">
              {latestPoems.map((poem) => (
                <PoemListItem key={poem.slug} poem={poem} />
              ))}
            </ul>
          </Reveal>
          {featuredPoem ? (
            <Reveal delay={120}>
              <FeaturedPoemCard poem={featuredPoem} />
            </Reveal>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-content gap-flow-m px-flow-s pb-flow-2xl md:grid-cols-2 md:px-flow-l">
        <Reveal>
          <TeaserCard
            title="Sobre Mim"
            description="Apaixonada por palavras, natureza e tudo que toca a alma."
            cta={{ label: "Conhecer minha história", href: "/sobre" }}
          />
        </Reveal>
        <Reveal delay={120}>
          <TeaserCard
            title="Portfólio"
            description="Além dos versos, exploro a criatividade em diferentes formas."
            cta={{ label: "Ver portfólio", href: "/portfolio" }}
          />
        </Reveal>
      </section>

      <Reveal>
        <QuoteBanner quote={settings.footerQuote} />
      </Reveal>
    </main>
  );
}
