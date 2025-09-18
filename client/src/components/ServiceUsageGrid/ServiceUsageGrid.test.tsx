import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ServiceUsageGrid } from "./ServiceUsageGrid";

describe("ServiceUsageGrid", () => {
  const base = {
    services: [],
    loading: false,
    error: null as string | null,
    counts: {},
    deletingServiceId: null as string | null,
    onDelete: vi.fn(),
  };

  it("renders loading", () => {
    render(<ServiceUsageGrid {...base} loading />);
    expect(screen.getByText(/loading services/i)).toBeInTheDocument();
  });

  it("renders error", () => {
    render(<ServiceUsageGrid {...base} error="Fail" />);
    expect(screen.getByText("Fail")).toBeInTheDocument();
  });

  it("renders empty", () => {
    render(<ServiceUsageGrid {...base} />);
    expect(screen.getByText(/no services available/i)).toBeInTheDocument();
  });

  it("lists services and handles delete", () => {
    const onDelete = vi.fn();
    render(
      <ServiceUsageGrid
        {...base}
        services={
          [
            {
              _id: "s1",
              name: "A",
              description: "d",
              price: 1,
              icon: "Box",
              category: "Box",
            },
          ] as any
        }
        counts={{ s1: 3 }}
        onDelete={onDelete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /delete service/i }));
    expect(onDelete).toHaveBeenCalled();
  });
});
