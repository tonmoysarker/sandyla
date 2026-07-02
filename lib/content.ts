import fs from "fs";
import path from "path";
import { load as parseYaml } from "js-yaml";
import { parseMdxFile } from "@/lib/mdx";
import { calculateReadingTime } from "@/lib/reading-time";
import {
  PoemFrontmatterSchema,
  ProjectFrontmatterSchema,
  CategorySchema,
  SiteSettingsSchema,
  type PoemFrontmatter,
  type ProjectFrontmatter,
  type Category,
  type SiteSettings,
} from "@/lib/types";
import { POEMS_DIR, PROJECTS_DIR, SETTINGS_FILE, CATEGORIES_FILE } from "@/lib/content-paths";

export type Poem = PoemFrontmatter & { content: string; readingTime: number };
export type Project = ProjectFrontmatter & { content: string };

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.join(dir, file));
}

export function getAllPoems(): Poem[] {
  return listMdxFiles(POEMS_DIR)
    .map((filePath) => {
      const { frontmatter, content } = parseMdxFile(filePath, PoemFrontmatterSchema);
      return {
        ...frontmatter,
        content,
        readingTime: frontmatter.readingTime ?? calculateReadingTime(content),
      };
    })
    .filter((poem) => poem.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPoemBySlug(slug: string): Poem | undefined {
  return getAllPoems().find((poem) => poem.slug === slug);
}

export function getRelatedPoems(poem: Poem, all: Poem[], limit = 3): Poem[] {
  return all
    .filter((candidate) => candidate.slug !== poem.slug && candidate.category === poem.category)
    .slice(0, limit);
}

export function getAllProjects(): Project[] {
  return listMdxFiles(PROJECTS_DIR)
    .map((filePath) => {
      const { frontmatter, content } = parseMdxFile(filePath, ProjectFrontmatterSchema);
      return { ...frontmatter, content };
    })
    .filter((project) => project.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((project) => project.slug === slug);
}

export function getCategories(): Category[] {
  if (!fs.existsSync(CATEGORIES_FILE)) return [];
  const raw = parseYaml(fs.readFileSync(CATEGORIES_FILE, "utf-8"));
  const list = Array.isArray(raw) ? raw : [];
  return list.map((entry) => CategorySchema.parse(entry));
}

export function getSiteSettings(): SiteSettings {
  const raw = parseYaml(fs.readFileSync(SETTINGS_FILE, "utf-8"));
  return SiteSettingsSchema.parse(raw);
}
