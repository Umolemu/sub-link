import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AdminContainer } from "./AdminContainer";

vi.mock("../../api/Users/Users", () => ({
  getUsers: vi.fn(async () => [
    { msisdn: "111", subscriptionCount: 1, monthlyRevenue: 10 },
  ]),
  getUserDetail: vi.fn(async () => ({
    msisdn: "111",
    createdAt: new Date().toISOString(),
    monthlyRevenue: 10,
    activeSubscriptions: [
      {
        serviceId: "svc1",
        name: "Alpha",
        price: 10,
        category: "Box",
        subscribedAt: new Date().toISOString(),
      },
    ],
  })),
}));

vi.mock("../../api/Services/Services", () => ({
  getServices: vi.fn(async () => [
    {
      _id: "svc1",
      name: "Alpha",
      description: "D",
      price: 10,
      icon: "Box",
      category: "Box",
    },
  ]),
  deleteService: vi.fn(async () => true),
}));

const originalConfirm = window.confirm;

describe("AdminContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);
  });

  it("renders users and services with R", async () => {
    render(
      <MemoryRouter>
        <AdminContainer />
      </MemoryRouter>
    );
    expect(await screen.findByText(/Admin Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText("111")).toBeInTheDocument();
    expect(screen.getByText(/^R\s*10\.00$/i)).toBeInTheDocument();
    expect(screen.getByText(/R\s*10\.00\s*\/ month/i)).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("deletes a service via grid action", async () => {
    render(
      <MemoryRouter>
        <AdminContainer />
      </MemoryRouter>
    );
    const delBtn = await screen.findByRole("button", {
      name: /delete service/i,
    });
    fireEvent.click(delBtn);
    await waitFor(() =>
      expect(screen.queryByText("Alpha")).not.toBeInTheDocument()
    );
  });

  afterAll(() => {
    window.confirm = originalConfirm;
  });
});
