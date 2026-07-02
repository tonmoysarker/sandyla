import { describe, it, expect } from "vitest";
import { buildSearchIndex } from "@/lib/search-index";
import type { Poem, Project } from "@/lib/content";

const poem: Poem = {
  title: "Poema A",
  slug: "poema-a",
  date: "2024-05-01",
  excerpt: "Excerto A",
  category: "sombras",
  tags: ["a"],
  featured: true,
  published: true,
  coverImage: "/images/a.jpg",
  content: "corpo",
  readingTime: 1,
};

const project: Project = {
  title: "Projeto A",
  slug: "projeto-a",
  date: "2024-05-01",
  excerpt: "Excerto do projeto",
  category: "ilustracao",
  coverImage: "/images/proj-a.jpg",
  gallery: [],
  featured: false,
  published: true,
  content: "corpo",
};

describe("buildSearchIndex", () => {
  it("produces one entry per poem with a /poemas/[slug] url", () => {
    const index = buildSearchIndex([poem], []);
    expect(index).toEqual([
      { title: "Poema A", excerpt: "Excerto A", tags: ["a"], url: "/poemas/poema-a", type: "poem" },
    ]);
  });

  it("produces one entry per project with a /portfolio/[slug] url", () => {
    const index = buildSearchIndex([], [project]);
    expect(index[0]).toMatchObject({ url: "/portfolio/projeto-a", type: "project" });
  });

  it("combines poems and projects into a single flat list", () => {
    const index = buildSearchIndex([poem], [project]);
    expect(index).toHaveLength(2);
  });
});
