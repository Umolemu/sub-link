import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddServiceForm } from "./AddServiceForm";

vi.mock("../../../api/Services/Services", () => ({
  createService: vi.fn(async (dto) => ({
    _id: "id1",
    name: dto.name,
    description: dto.description,
    price: dto.price,
    category: dto.category,
    icon: dto.icon,
  })),
}));

describe("AddServiceForm", () => {
  const iconOptions = ["Phone", "Box"];

  it("validates required fields", async () => {
    const onCreated = vi.fn();
    render(
      <AddServiceForm iconOptions={iconOptions} onServiceCreated={onCreated} />
    );

    const submitBtn = screen.getByRole("button", { name: /create service/i });
    const form = submitBtn.closest("form")!;
    fireEvent.submit(form);

    expect(
      await screen.findByText(/service name is required/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/valid price is required/i)).toBeInTheDocument();
    expect(onCreated).not.toHaveBeenCalled();
  });

  it("submits valid form and resets fields", async () => {
    const onCreated = vi.fn();
    render(
      <AddServiceForm iconOptions={iconOptions} onServiceCreated={onCreated} />
    );

    fireEvent.change(screen.getByPlaceholderText(/premium video/i), {
      target: { value: "Premium" },
    });
    fireEvent.change(screen.getByPlaceholderText(/short description/i), {
      target: { value: "Desc" },
    });
    fireEvent.change(screen.getByPlaceholderText(/R9.99 \/ month/i), {
      target: { value: "12.50" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create service/i }));

    expect(
      await screen.findByRole("button", { name: /creating/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /create service/i })
    ).toBeInTheDocument();
    expect(onCreated).toHaveBeenCalled();
  });
});
