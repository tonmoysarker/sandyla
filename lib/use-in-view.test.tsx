import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useInView } from "@/lib/use-in-view";

function Probe() {
  const { ref, isVisible } = useInView<HTMLDivElement>();
  return <div ref={ref} data-testid="probe" data-visible={isVisible} />;
}

describe("useInView", () => {
  it("becomes visible once the element is observed (mocked IntersectionObserver fires immediately)", () => {
    render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveAttribute("data-visible", "true");
  });
});
