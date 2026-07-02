import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PoemasPage from "@/app/poemas/page";

describe("PoemasPage", () => {
  it("renders the page title and a card for every published poem", () => {
    render(<PoemasPage />);
    expect(screen.getByRole("heading", { name: /poemas/i })).toBeInTheDocument();
    expect(screen.getByText("Entre Silêncios e Suspiros")).toBeInTheDocument();
    expect(screen.getByText("A Noite Também Escreve")).toBeInTheDocument();
    expect(screen.getByText("Cartas que Nunca Enviei")).toBeInTheDocument();
  });

  it("includes a search bar", () => {
    render(<PoemasPage />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });
});
