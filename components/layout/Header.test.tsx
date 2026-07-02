import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";

const nav = [
  { label: "Início", href: "/" },
  { label: "Poemas", href: "/poemas" },
];

describe("Header", () => {
  it("renders the site title and all nav links", () => {
    render(<Header nav={nav} siteTitle="Versos" />);
    expect(screen.getByText("Versos")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Poemas" })).toHaveAttribute("href", "/poemas");
  });

  it("mobile nav is closed by default and opens when the toggle is clicked", async () => {
    render(<Header nav={nav} siteTitle="Versos" />);
    const toggle = screen.getByRole("button", { name: /abrir menu/i });
    expect(screen.getByTestId("mobile-nav")).toHaveAttribute("data-open", "false");
    await userEvent.click(toggle);
    expect(screen.getByTestId("mobile-nav")).toHaveAttribute("data-open", "true");
  });
});
