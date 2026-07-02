import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/home/Hero";

const props = {
  heroTitleLine1: "Palavras que",
  heroTitleLine2: "Florescem",
  heroSubtitle: "Um espaço onde sentimentos ganham forma em versos.",
  heroPrimaryCta: { label: "Ler Poemas", href: "/poemas" },
  heroSecondaryCta: { label: "Sobre Mim", href: "/sobre" },
};

describe("Hero", () => {
  it("renders both headline lines and the subtitle", () => {
    render(<Hero {...props} />);
    expect(screen.getByText("Palavras que")).toBeInTheDocument();
    expect(screen.getByText("Florescem")).toBeInTheDocument();
    expect(screen.getByText(props.heroSubtitle)).toBeInTheDocument();
  });

  it("renders both CTAs as links to the correct hrefs", () => {
    render(<Hero {...props} />);
    expect(screen.getByRole("link", { name: "Ler Poemas" })).toHaveAttribute("href", "/poemas");
    expect(screen.getByRole("link", { name: "Sobre Mim" })).toHaveAttribute("href", "/sobre");
  });

  it("renders the stained-glass illustration as a two-column layout, not a stacked photo", () => {
    render(<Hero {...props} />);
    const section = screen.getByTestId("hero-section");
    expect(section.className).toMatch(/md:grid-cols-2/);
    expect(screen.getByTestId("stained-glass-rose")).toBeInTheDocument();
  });
});
