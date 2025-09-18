import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SubscriptionsTable } from "./SubscriptionsTable";

describe("SubscriptionsTable", () => {
  const user = {
    msisdn: "123",
    createdAt: new Date().toISOString(),
    monthlyRevenue: 10,
    activeSubscriptions: [],
  } as any;

  it("shows empty state", () => {
    render(
      <SubscriptionsTable
        user={user}
        removingServiceId={null}
        onRemove={vi.fn()}
      />
    );
    expect(screen.getByText(/no active subscriptions/i)).toBeInTheDocument();
  });

  it("renders rows and calls onRemove", () => {
    const onRemove = vi.fn();
    const u = {
      ...user,
      activeSubscriptions: [
        {
          serviceId: "s1",
          name: "A",
          price: 2,
          category: "Box",
          subscribedAt: new Date().toISOString(),
        },
      ],
    } as any;
    render(
      <SubscriptionsTable
        user={u}
        removingServiceId={null}
        onRemove={onRemove}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(onRemove).toHaveBeenCalledWith("s1", 2);
  });
});
