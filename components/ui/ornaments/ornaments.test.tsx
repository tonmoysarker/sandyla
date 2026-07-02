import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VineDivider } from "@/components/ui/ornaments/VineDivider";
import { RoseBullet } from "@/components/ui/ornaments/RoseBullet";
import { ArchFrame } from "@/components/ui/ornaments/ArchFrame";

describe("VineDivider", () => {
  it("renders an svg marked decorative (aria-hidden)", () => {
    render(<VineDivider />);
    expect(screen.getByTestId("vine-divider")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("RoseBullet", () => {
  it("renders an svg marked decorative", () => {
    render(<RoseBullet />);
    expect(screen.getByTestId("rose-bullet")).toHaveAttribute("aria-hidden", "true");
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
