import { describe, it, expect } from "vitest";
import { getAllPoems, getAllProjects, getCategories, getSiteSettings } from "@/lib/content";

// Validates the real /content files against the zod schemas — no mocked paths.
// Fails when a content file is malformed, before the build does.
describe("real content validation", () => {
  it("parses all published poems", () => {
    expect(getAllPoems().length).toBeGreaterThanOrEqual(3);
  });

  it("parses all published projects", () => {
    expect(getAllProjects().length).toBeGreaterThanOrEqual(2);
  });

  it("parses all categories", () => {
    expect(getCategories().length).toBeGreaterThanOrEqual(4);
  });

  it("parses site settings", () => {
    expect(getSiteSettings().siteTitle).toBe("Versos");
  });

  it("every poem/project category exists in categories.yaml", () => {
    const known = new Set(getCategories().map((c) => c.slug));
    for (const poem of getAllPoems()) {
      expect(known, `poem "${poem.slug}" has unknown category "${poem.category}"`).toContain(poem.category);
    }
    for (const project of getAllProjects()) {
      expect(known, `project "${project.slug}" has unknown category "${project.category}"`).toContain(project.category);
    }
  });
});
