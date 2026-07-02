import { describe, it, expect } from "vitest";
import { getHomeContent } from "@/lib/content";

describe("getHomeContent (real content)", () => {
  it("returns the real home hero copy", () => {
    const home = getHomeContent();
    expect(home.heroTitleLine1).toBe("Palavras que");
    expect(home.heroTitleLine2).toBe("Florescem");
    expect(home.heroPrimaryCta).toEqual({ label: "Ler Poemas", href: "/poemas" });
  });
});
