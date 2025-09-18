import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { UserDetailContainer } from "./UserDetailContainer";

vi.mock("../../api/Users/Users", () => ({
  getUserDetail: vi.fn(async (msisdn: string) => ({
    msisdn,
    createdAt: new Date().toISOString(),
    monthlyRevenue: 5,
    activeSubscriptions: [
      {
        serviceId: "s1",
        name: "A",
        price: 2,
        category: "Box",
        subscribedAt: new Date().toISOString(),
      },
    ],
  })),
}));

vi.mock("../../api/Subscriptions/Subscriptions", () => ({
  unsubscribeByAdmin: vi.fn(async () => true),
}));

describe("UserDetailContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRoute = (msisdn: string) =>
    render(
      <MemoryRouter initialEntries={[`/admin/users/${msisdn}`]}>
        <Routes>
          <Route
            path="/admin/users/:msisdn"
            element={<UserDetailContainer />}
          />
        </Routes>
      </MemoryRouter>
    );

  it("loads and displays user info", async () => {
    renderWithRoute("123");
    expect(await screen.findByText(/user 123/i)).toBeInTheDocument();
    expect(screen.getByText(/active subscriptions/i)).toBeInTheDocument();
  });

  it("removes a subscription when clicking remove", async () => {
    renderWithRoute("123");
    const btn = await screen.findByRole("button", { name: /remove/i });
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.queryByText("$2.00")).not.toBeInTheDocument()
    );
  });
});
