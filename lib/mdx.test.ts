import { describe, it, expect } from "vitest";
import path from "path";
import { parseMdxFile } from "@/lib/mdx";
import { PoemFrontmatterSchema } from "@/lib/types";

describe("parseMdxFile", () => {
  const fixturePath = path.join(process.cwd(), "tests/fixtures/sample-poem.mdx");

  it("parses front matter validated against the given schema", () => {
    const { frontmatter } = parseMdxFile(fixturePath, PoemFrontmatterSchema);
    expect(frontmatter.title).toBe("Poema de Teste");
    expect(frontmatter.slug).toBe("poema-de-teste");
    expect(frontmatter.tags).toEqual(["teste"]);
  });

  it("returns the raw MDX body content", () => {
    const { content } = parseMdxFile(fixturePath, PoemFrontmatterSchema);
    expect(content).toContain("Este é o corpo do poema de teste.");
  });

  it("throws a descriptive error when front matter fails schema validation", () => {
    const badFixture = path.join(process.cwd(), "tests/fixtures/sample-poem.mdx");
    expect(() =>
      parseMdxFile(badFixture, PoemFrontmatterSchema.extend({
        nonExistentRequiredField: (PoemFrontmatterSchema as any).shape.title,
      }) as any)
    ).toThrow();
  });
});
