import { describe, it, expect } from "vitest";
import { GET } from "@/app/feed.xml/route";

describe("RSS feed route", () => {
  it("returns XML containing every published poem title", async () => {
    const response = await GET();
    const body = await response.text();
    expect(body).toContain("<?xml");
    expect(body).toContain("Entre Silêncios e Suspiros");
    expect(body).toContain("A Noite Também Escreve");
  });

  it("sets the content type to application/rss+xml", async () => {
    const response = await GET();
    expect(response.headers.get("Content-Type")).toBe("application/rss+xml");
  });
});
