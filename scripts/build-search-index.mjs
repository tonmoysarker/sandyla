// Regenerates public/search-index.json from /content at build time (npm prebuild).
// Standalone on purpose: runs before the TS toolchain, so it re-reads front matter
// with gray-matter directly instead of importing lib/content.ts. Keep the entry
// shape in sync with SearchEntry in lib/search-index.ts.
import fs from "fs";
import path from "path";
import matter from "gray-matter";

function readEntries(dir, toEntry) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => matter(fs.readFileSync(path.join(dir, file), "utf-8")).data)
    .filter((data) => data.published !== false)
    .map(toEntry);
}

const poems = readEntries(path.join(process.cwd(), "content/poems"), (data) => ({
  title: data.title,
  excerpt: data.excerpt,
  tags: data.tags ?? [],
  url: `/poemas/${data.slug}`,
  type: "poem",
}));

const projects = readEntries(path.join(process.cwd(), "content/projects"), (data) => ({
  title: data.title,
  excerpt: data.excerpt,
  tags: [],
  url: `/portfolio/${data.slug}`,
  type: "project",
}));

const index = [...poems, ...projects];
const outDir = path.join(process.cwd(), "public");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "search-index.json");
fs.writeFileSync(outPath, JSON.stringify(index, null, 2));
console.log(`Wrote ${index.length} entries to ${outPath}`);
