import { describe, it, expect, vi } from "vitest";
import path from "path";

const FIXTURE_DIR = path.join(process.cwd(), "tests/fixtures/content");

vi.mock("@/lib/content-paths", () => ({
  POEMS_DIR: path.join(FIXTURE_DIR, "poems"),
}));

import { getAllPoems, getPoemBySlug, getRelatedPoems } from "@/lib/content";

describe("getAllPoems", () => {
  it("returns only published poems, sorted newest first", () => {
    const poems = getAllPoems();
    expect(poems.map((p) => p.slug)).toEqual(["poema-b", "poema-a"]);
  });

  it("attaches a computed readingTime to each poem", () => {
    const poems = getAllPoems();
    expect(poems.every((p) => typeof p.readingTime === "number" && p.readingTime >= 1)).toBe(true);
  });
});

describe("getPoemBySlug", () => {
  it("returns the matching poem", () => {
    const poem = getPoemBySlug("poema-a");
    expect(poem?.title).toBe("Poema A");
  });

  it("returns undefined for an unpublished poem", () => {
    expect(getPoemBySlug("poema-c")).toBeUndefined();
  });

  it("returns undefined for a nonexistent slug", () => {
    expect(getPoemBySlug("nao-existe")).toBeUndefined();
  });
});

describe("getRelatedPoems", () => {
  it("returns poems in the same category, excluding the current poem", () => {
    const all = getAllPoems();
    const current = getPoemBySlug("poema-a")!;
    const related = getRelatedPoems(current, all, 3);
    expect(related.find((p) => p.slug === "poema-a")).toBeUndefined();
    expect(related.every((p) => p.category === current.category)).toBe(true);
  });

  it("respects the limit parameter", () => {
    const all = getAllPoems();
    const current = getPoemBySlug("poema-a")!;
    const related = getRelatedPoems(current, all, 1);
    expect(related.length).toBeLessThanOrEqual(1);
  });
});
