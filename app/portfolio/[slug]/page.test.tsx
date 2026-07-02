import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectDetailPage from "@/app/portfolio/[slug]/page";

describe("ProjectDetailPage", () => {
  it("renders the project title and body", () => {
    const Page = ProjectDetailPage({ params: { slug: "lamento-celeste" } });
    render(Page as React.ReactElement);
    expect(screen.getByRole("heading", { name: "Lamento Celeste" })).toBeInTheDocument();
  });
});
