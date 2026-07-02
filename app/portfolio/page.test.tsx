import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PortfolioPage from "@/app/portfolio/page";

describe("PortfolioPage", () => {
  it("renders a card for every published project", () => {
    render(<PortfolioPage />);
    expect(screen.getByText("Lamento Celeste")).toBeInTheDocument();
    expect(screen.getByText("Sussurros da Palavra")).toBeInTheDocument();
  });
});
