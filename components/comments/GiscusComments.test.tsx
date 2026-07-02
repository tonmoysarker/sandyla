import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { GiscusComments } from "@/components/comments/GiscusComments";

describe("GiscusComments", () => {
  it("configures the giscus script with the repo and category from settings", () => {
    render(<GiscusComments repo="owner/repo" category="Poemas" />);
    const script = document.querySelector("script[data-repo]");
    expect(script).toHaveAttribute("data-repo", "owner/repo");
    expect(script).toHaveAttribute("data-category", "Poemas");
  });
});
