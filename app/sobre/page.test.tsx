import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SobrePage from "@/app/sobre/page";

describe("SobrePage", () => {
  it("renders the about page title and body", () => {
    render(<SobrePage />);
    expect(screen.getByRole("heading", { name: "Sobre Mim" })).toBeInTheDocument();
    expect(screen.getByText(/Apaixonada por palavras/)).toBeInTheDocument();
  });
});
