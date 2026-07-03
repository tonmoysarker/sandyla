import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VineDivider } from "@/components/ui/ornaments/VineDivider";
import { CornerFlourish } from "@/components/ui/ornaments/CornerFlourish";
import { ArchFrame } from "@/components/ui/ornaments/ArchFrame";
import { StainedGlassRose } from "@/components/ui/ornaments/StainedGlassRose";

describe("VineDivider", () => {
  it("renders an svg marked decorative (aria-hidden)", () => {
    render(<VineDivider />);
    expect(screen.getByTestId("vine-divider")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("CornerFlourish", () => {
  it("renders an svg marked decorative", () => {
    render(<CornerFlourish />);
    expect(screen.getByTestId("corner-flourish")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("ArchFrame", () => {
  it("renders its children inside the arch wrapper", () => {
    render(
      <ArchFrame>
        <img src="/x.jpg" alt="Retrato" />
      </ArchFrame>
    );
    expect(screen.getByAltText("Retrato")).toBeInTheDocument();
  });
});

describe("StainedGlassRose", () => {
  it("is exposed to assistive tech as a labelled image", () => {
    render(<StainedGlassRose />);
    expect(screen.getByRole("img")).toHaveAccessibleName(/rosa em vitral/i);
  });
});
