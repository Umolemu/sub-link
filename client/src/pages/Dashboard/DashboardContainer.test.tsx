import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { DashboardContainer } from "./DashboardContainer";

vi.mock("../../api/Services/Services", () => ({
  getServices: vi.fn(async () => [
    {
      _id: "a",
      name: "Alpha",
      description: "DA",
      price: 10,
      icon: "Box",
      category: "Box",
    },
    {
      _id: "b",
      name: "Beta",
      description: "DB",
      price: 5.5,
      icon: "Box",
      category: "Box",
    },
  ]),
}));

vi.mock("../../api/Subscriptions/Subscriptions", () => ({
  getUserSubscriptions: vi.fn(async () => [{ _id: "s1", serviceId: "a" }]),
  subscribe: vi.fn(async (id: string) => ({ _id: "s2", serviceId: id })),
  unsubscribe: vi.fn(async () => true),
}));

const onMap = new Map<string, Function[]>();
vi.mock("../../realtime/socket", () => ({
  getSocket: () => ({
    on: (evt: string, fn: any) => {
      const arr = onMap.get(evt) || [];
      arr.push(fn);
      onMap.set(evt, arr);
    },
    off: (evt: string, fn: any) => {
      onMap.set(
        evt,
        (onMap.get(evt) || []).filter((f) => f !== fn)
      );
    },
  }),
}));

describe("DashboardContainer", () => {
  beforeEach(() => {
    onMap.clear();
    vi.clearAllMocks();
  });

  it("renders active and available with R pricing", async () => {
    render(<DashboardContainer />);
    expect(
      await screen.findByText(/Active Subscriptions/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/R10.00 \/ month/i)).toBeInTheDocument();
    expect(screen.getByText(/R5.50 \/ month/i)).toBeInTheDocument();
  });

  it("subscribes via PaymentPopup flow", async () => {
    render(<DashboardContainer />);
    const subscribeBtn = await screen.findByRole("button", {
      name: /^subscribe$/i,
    });
    fireEvent.click(subscribeBtn);
    fireEvent.click(screen.getByLabelText("PayPal"));
    fireEvent.click(screen.getByRole("button", { name: /pay/i }));
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: /pay/i })
      ).not.toBeInTheDocument()
    );
  });

  it("reacts to socket events for serviceCreated", async () => {
    render(<DashboardContainer />);
    await screen.findByText(/Active Subscriptions/i);
    const fns = onMap.get("serviceCreated") || [];
    fns.forEach((fn) =>
      fn({
        _id: "c",
        name: "Gamma",
        description: "",
        price: 3,
        icon: "Box",
        category: "Box",
      })
    );
    await waitFor(() => expect(screen.getByText("Gamma")).toBeInTheDocument());
  });
});
