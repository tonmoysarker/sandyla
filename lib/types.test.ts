import { describe, it, expect } from "vitest";
import { PoemFrontmatterSchema } from "@/lib/types";

describe("PoemFrontmatterSchema", () => {
  it("accepts a complete valid poem front matter", () => {
    const result = PoemFrontmatterSchema.safeParse({
      title: "Entre Silêncios e Suspiros",
      slug: "entre-silencios-e-suspiros",
      date: "2024-05-18",
      excerpt: "Há palavras que não ousamos dizer.",
      category: "sombras",
      tags: ["silêncio", "noite"],
      featured: true,
      published: true,
      coverImage: "/images/poems/entre-silencios.jpg",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a poem missing the required title field", () => {
    const result = PoemFrontmatterSchema.safeParse({
      slug: "sem-titulo",
      date: "2024-05-18",
      excerpt: "Texto.",
      category: "sombras",
      tags: [],
      featured: false,
      published: true,
      coverImage: "/images/poems/x.jpg",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a date that is not in YYYY-MM-DD format", () => {
    const result = PoemFrontmatterSchema.safeParse({
      title: "Título",
      slug: "titulo",
      date: "18/05/2024",
      excerpt: "Texto.",
      category: "sombras",
      tags: [],
      featured: false,
      published: true,
      coverImage: "/images/poems/x.jpg",
    });
    expect(result.success).toBe(false);
  });
});
