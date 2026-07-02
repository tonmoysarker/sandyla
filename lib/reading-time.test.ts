import { describe, it, expect } from "vitest";
import { calculateReadingTime } from "@/lib/reading-time";

describe("calculateReadingTime", () => {
  it("returns 1 minute for very short text", () => {
    expect(calculateReadingTime("Um poema curto.")).toBe(1);
  });

  it("returns 2 minutes for ~400 words at 200wpm", () => {
    const text = Array(400).fill("palavra").join(" ");
    expect(calculateReadingTime(text)).toBe(2);
  });

  it("rounds up rather than down", () => {
    const text = Array(201).fill("palavra").join(" ");
    expect(calculateReadingTime(text)).toBe(2);
  });
});
