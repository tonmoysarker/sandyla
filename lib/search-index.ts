import type { Poem, Project } from "@/lib/content";

export type SearchEntry = {
  title: string;
  excerpt: string;
  tags: string[];
  url: string;
  type: "poem" | "project";
};

export function buildSearchIndex(poems: Poem[], projects: Project[]): SearchEntry[] {
  const poemEntries: SearchEntry[] = poems.map((poem) => ({
    title: poem.title,
    excerpt: poem.excerpt,
    tags: poem.tags,
    url: `/poemas/${poem.slug}`,
    type: "poem",
  }));

  const projectEntries: SearchEntry[] = projects.map((project) => ({
    title: project.title,
    excerpt: project.excerpt,
    tags: [],
    url: `/portfolio/${project.slug}`,
    type: "project",
  }));

  return [...poemEntries, ...projectEntries];
}
