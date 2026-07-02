import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CardGridPage } from "@/components/templates/CardGridPage";

type Item = { id: string; name: string };

describe("CardGridPage", () => {
  const items: Item[] = [{ id: "1", name: "Item Um" }, { id: "2", name: "Item Dois" }];

  it("renders one card per item using the provided renderCard function", () => {
    render(
      <CardGridPage
        items={items}
        renderCard={(item) => <div key={item.id}>{item.name}</div>}
        filterOptions={[{ slug: "todos", label: "Todos" }]}
        activeFilter="todos"
        onFilterChange={vi.fn()}
        currentPage={1}
        totalPages={1}
        baseHref="/poemas"
      />
    );
    expect(screen.getByText("Item Um")).toBeInTheDocument();
    expect(screen.getByText("Item Dois")).toBeInTheDocument();
  });

  it("renders the filter chips", () => {
    render(
      <CardGridPage
        items={items}
        renderCard={(item) => <div key={item.id}>{item.name}</div>}
        filterOptions={[{ slug: "todos", label: "Todos" }]}
        activeFilter="todos"
        onFilterChange={vi.fn()}
        currentPage={1}
        totalPages={1}
        baseHref="/poemas"
      />
    );
    expect(screen.getByRole("button", { name: "Todos" })).toBeInTheDocument();
  });
});
