import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeaserCard } from "@/components/home/TeaserCard";

describe("TeaserCard", () => {
  it("renders title, description, and a CTA link", () => {
    render(
      <TeaserCard
        title="Sobre Mim"
        description="Texto de exemplo."
        cta={{ label: "Conhecer minha história", href: "/sobre" }}
      />
    );
    expect(screen.getByText("Sobre Mim")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Conhecer minha história" })).toHaveAttribute("href", "/sobre");
  });
});
