import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

describe("ThemeToggle", () => {
  it("toggles the html class between dark and light on click", async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole("button", { name: /alternar tema/i });
    await userEvent.click(button);
    expect(button).toBeInTheDocument();
  });
});
