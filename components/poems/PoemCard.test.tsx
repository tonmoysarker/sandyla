import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PoemCard } from "@/components/poems/PoemCard";
import type { Poem } from "@/lib/content";

const poem: Poem = {
  title: "O Vitral Coroado",
  slug: "o-vitral-coroado",
  date: "2024-05-01",
  excerpt: "Excerto do poema.",
  category: "sombras",
  tags: ["a"],
  featured: false,
  published: true,
  coverImage: "/x.jpg",
  content: "corpo",
  readingTime: 3,
};

describe("PoemCard", () => {
  it("links to the poem and shows title, excerpt, and reading time", () => {
    render(<PoemCard poem={poem} />);
    expect(screen.getByRole("link", { name: /O Vitral Coroado/ })).toHaveAttribute(
      "href",
      "/poemas/o-vitral-coroado"
    );
    expect(screen.getByText("Excerto do poema.")).toBeInTheDocument();
    expect(screen.getByText(/3 min/)).toBeInTheDocument();
  });
});
