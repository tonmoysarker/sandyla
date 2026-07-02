import fs from "fs";
import matter from "gray-matter";
import type { ZodSchema } from "zod";

export function parseMdxFile<T>(filePath: string, schema: ZodSchema<T>): { frontmatter: T; content: string } {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(
      `Invalid front matter in ${filePath}:\n${result.error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n")}`
    );
  }

  return { frontmatter: result.data, content };
}
