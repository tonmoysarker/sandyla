import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pagination } from "@/components/ui/Pagination";

describe("Pagination", () => {
  it("renders a link for every page", () => {
    render(<Pagination currentPage={1} totalPages={3} baseHref="/poemas" />);
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute("href", "/poemas?page=1");
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("href", "/poemas?page=2");
    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute("href", "/poemas?page=3");
  });

  it("marks the current page as aria-current", () => {
    render(<Pagination currentPage={2} totalPages={3} baseHref="/poemas" />);
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page");
  });

  it("renders nothing when there is only one page", () => {
    render(<Pagination currentPage={1} totalPages={1} baseHref="/poemas" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
