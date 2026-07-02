import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the hero headline from real content", () => {
    render(<HomePage />);
    expect(screen.getByText("Florescem")).toBeInTheDocument();
  });

  it("renders a list of latest poems", () => {
    render(<HomePage />);
    expect(screen.getByText("Últimos Poemas")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /A Noite Também Escreve/ })).toBeInTheDocument();
  });

  it("renders the featured poem card", () => {
    render(<HomePage />);
    expect(screen.getByText("Destaque")).toBeInTheDocument();
  });

  it("renders About and Portfolio teaser cards", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: "Sobre Mim" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Portfólio" })).toBeInTheDocument();
  });

  it("renders the footer quote as a QuoteBanner", () => {
    render(<HomePage />);
    expect(screen.getByText(/eco da alma/)).toBeInTheDocument();
  });
});
