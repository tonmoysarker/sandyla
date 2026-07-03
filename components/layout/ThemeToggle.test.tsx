import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

describe("ThemeToggle", () => {
  it("switches from dark to light and back, updating the html class", async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = await screen.findByRole("button", { name: /ativar tema claro/i });
    await userEvent.click(button);
    expect(document.documentElement).toHaveClass("light");
    expect(screen.getByRole("button", { name: /ativar tema escuro/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /ativar tema escuro/i }));
    expect(document.documentElement).toHaveClass("dark");
  });

  it("persists the chosen theme to localStorage", async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = await screen.findByRole("button", { name: /ativar tema claro/i });
    await userEvent.click(button);
    expect(window.localStorage.getItem("theme")).toBe("light");
  });
});
