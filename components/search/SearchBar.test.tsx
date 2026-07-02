import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/search/SearchBar";

const index = [
  { title: "Entre Silêncios e Suspiros", excerpt: "...", tags: ["silêncio"], url: "/poemas/a", type: "poem" as const },
  { title: "Cartas que Nunca Enviei", excerpt: "...", tags: ["saudade"], url: "/poemas/b", type: "poem" as const },
];

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ json: () => Promise.resolve(index) })
  );
});

describe("SearchBar", () => {
  it("shows matching results as the user types", async () => {
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await userEvent.type(input, "Silêncios");
    expect(await screen.findByRole("link", { name: /Entre Silêncios e Suspiros/ })).toBeInTheDocument();
    expect(screen.queryByText("Cartas que Nunca Enviei")).not.toBeInTheDocument();
  });

  it("shows no results message for a query that matches nothing", async () => {
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await userEvent.type(input, "xyz-nao-existe");
    expect(await screen.findByText(/Nenhum resultado/i)).toBeInTheDocument();
  });
});
