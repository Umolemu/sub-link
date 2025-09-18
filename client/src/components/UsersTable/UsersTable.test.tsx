import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UsersTable } from "./UsersTable";

describe("UsersTable", () => {
  const baseProps = {
    users: [],
    loading: false,
    error: null as string | null,
    onView: vi.fn(),
  };

  it("shows loading", () => {
    render(<UsersTable {...baseProps} loading={true} />);
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
  });

  it("shows error", () => {
    render(<UsersTable {...baseProps} error="Oops" />);
    expect(screen.getByText("Oops")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<UsersTable {...baseProps} />);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it("renders users and triggers onView", () => {
    const onView = vi.fn();
    render(
      <UsersTable
        {...baseProps}
        users={
          [{ msisdn: "123", subscriptionCount: 2, monthlyRevenue: 10 }] as any
        }
        onView={onView}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /view/i }));
    expect(onView).toHaveBeenCalledWith("123");
  });
});
