import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterChips } from "@/components/ui/FilterChips";

const options = [
  { slug: "sombras", label: "Sombras" },
  { slug: "luz", label: "Luz" },
];

describe("FilterChips", () => {
  it("marks the active chip with aria-pressed=true", () => {
    render(<FilterChips options={options} activeSlug="sombras" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "Sombras" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Luz" })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onSelect with the chip's slug when clicked", async () => {
    const onSelect = vi.fn();
    render(<FilterChips options={options} activeSlug="sombras" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: "Luz" }));
    expect(onSelect).toHaveBeenCalledWith("luz");
  });
});
