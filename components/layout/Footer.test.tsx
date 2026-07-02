import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import type { SiteSettings } from "@/lib/types";

const settings: SiteSettings = {
  siteTitle: "Versos",
  tagline: "Palavras que florescem",
  nav: [{ label: "Poemas", href: "/poemas" }],
  socials: [{ platform: "instagram", url: "https://instagram.com/versos" }],
  footerQuote: "A poesia é o eco da alma que se recusa a ficar em silêncio.",
  giscus: { repo: "owner/repo", category: "Poemas" },
};

describe("Footer", () => {
  it("renders the footer quote", () => {
    render(<Footer settings={settings} />);
    expect(screen.getByText(new RegExp(settings.footerQuote))).toBeInTheDocument();
  });

  it("renders nav links", () => {
    render(<Footer settings={settings} />);
    expect(screen.getByRole("link", { name: "Poemas" })).toHaveAttribute("href", "/poemas");
  });

  it("renders social links with the platform name accessible", () => {
    render(<Footer settings={settings} />);
    expect(screen.getByRole("link", { name: /instagram/i })).toHaveAttribute(
      "href",
      "https://instagram.com/versos"
    );
  });

  it("does not render a newsletter form", () => {
    render(<Footer settings={settings} />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
