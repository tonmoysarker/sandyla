import { describe, it, expect } from "vitest";
import { buildPoemMetadata, buildPoemJsonLd } from "@/lib/seo";
import type { Poem } from "@/lib/content";
import type { SiteSettings } from "@/lib/types";

const poem: Poem = {
  title: "Entre Silêncios e Suspiros",
  slug: "entre-silencios-e-suspiros",
  date: "2024-05-18",
  excerpt: "Há palavras que não ousamos dizer.",
  category: "sombras",
  tags: ["silêncio"],
  featured: true,
  published: true,
  coverImage: "/images/poem.jpg",
  content: "corpo",
  readingTime: 2,
};

const settings: SiteSettings = {
  siteTitle: "Versos",
  tagline: "Palavras que florescem",
  nav: [],
  socials: [],
  footerQuote: "A poesia é o eco da alma que se recusa a ficar em silêncio.",
  giscus: { repo: "owner/repo", category: "Poemas" },
};

describe("buildPoemMetadata", () => {
  it("sets title to the poem title suffixed with the site title", () => {
    const metadata = buildPoemMetadata(poem, settings);
    expect(metadata.title).toBe("Entre Silêncios e Suspiros | Versos");
  });

  it("falls back to the poem excerpt when no seo.description is set", () => {
    const metadata = buildPoemMetadata(poem, settings);
    expect(metadata.description).toBe(poem.excerpt);
  });

  it("uses the poem's own seo.description when provided", () => {
    const metadata = buildPoemMetadata({ ...poem, seo: { description: "Custom." } }, settings);
    expect(metadata.description).toBe("Custom.");
  });
});

describe("buildPoemJsonLd", () => {
  it("produces a schema.org BlogPosting object", () => {
    const jsonLd = buildPoemJsonLd(poem, settings) as any;
    expect(jsonLd["@type"]).toBe("BlogPosting");
    expect(jsonLd.headline).toBe(poem.title);
    expect(jsonLd.datePublished).toBe(poem.date);
  });
});
