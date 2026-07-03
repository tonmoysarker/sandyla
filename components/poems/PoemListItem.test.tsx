import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PoemListItem } from "@/components/poems/PoemListItem";
import type { Poem } from "@/lib/content";

const poem: Poem = {
  title: "Entre Silêncios e Suspiros",
  slug: "entre-silencios-e-suspiros",
  date: "2024-05-18",
  excerpt: "Excerto",
  category: "sombras",
  tags: [],
  featured: true,
  published: true,
  coverImage: "/x.jpg",
  content: "corpo",
  readingTime: 2,
};

describe("PoemListItem", () => {
  it("links to the poem detail page and shows a formatted date", () => {
    render(<PoemListItem poem={poem} />);
    expect(screen.getByRole("link", { name: /Entre Silêncios e Suspiros/ })).toHaveAttribute(
      "href",
      "/poemas/entre-silencios-e-suspiros"
    );
    expect(screen.getByText("18 de maio de 2024")).toBeInTheDocument();
  });

  it("renders a decorative flourish icon in a circular frame", () => {
    render(<PoemListItem poem={poem} />);
    expect(screen.getByTestId("icon-flourish")).toBeInTheDocument();
  });
});
