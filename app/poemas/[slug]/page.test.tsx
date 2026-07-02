import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PoemDetailPage from "@/app/poemas/[slug]/page";

describe("PoemDetailPage", () => {
  it("renders the poem title and body", async () => {
    const Page = await PoemDetailPage({ params: { slug: "entre-silencios-e-suspiros" } });
    render(Page as React.ReactElement);
    expect(screen.getByRole("heading", { name: "Entre Silêncios e Suspiros" })).toBeInTheDocument();
  });

  it("renders related poems from the same category", async () => {
    const Page = await PoemDetailPage({ params: { slug: "entre-silencios-e-suspiros" } });
    render(Page as React.ReactElement);
    expect(screen.getByText("A Noite Também Escreve")).toBeInTheDocument();
  });

  it("renders the comments section", async () => {
    const Page = await PoemDetailPage({ params: { slug: "entre-silencios-e-suspiros" } });
    render(Page as React.ReactElement);
    expect(document.querySelector("script[data-repo]")).toBeInTheDocument();
  });
});
