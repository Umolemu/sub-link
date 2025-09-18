import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { TransactionsContainer } from "./TransactionsContainer";

vi.mock("../../api/Transactions/Transactions", () => ({
  getUserTransactions: vi.fn(async () => [
    {
      _id: "t1",
      timestamp: Date.now(),
      serviceName: "Alpha",
      type: "SUBSCRIBE",
      amount: 10,
    },
  ]),
}));

const onMapTx = new Map<string, Function[]>();
vi.mock("../../realtime/socket", () => ({
  getSocket: () => ({
    on: (evt: string, fn: any) => {
      const arr = onMapTx.get(evt) || [];
      arr.push(fn);
      onMapTx.set(evt, arr);
    },
    off: (evt: string, fn: any) => {
      onMapTx.set(
        evt,
        (onMapTx.get(evt) || []).filter((f) => f !== fn)
      );
    },
  }),
}));

describe("TransactionsContainer", () => {
  beforeEach(() => {
    onMapTx.clear();
    vi.clearAllMocks();
  });

  it("renders initial transactions", async () => {
    render(<TransactionsContainer />);
    expect(await screen.findByText(/Transaction History/i)).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("SUBSCRIBE")).toBeInTheDocument();
  });

  it("appends new transactions from socket", async () => {
    render(<TransactionsContainer />);
    await screen.findByText("Alpha");
    const fns = onMapTx.get("transactionCreated") || [];
    fns.forEach((fn) =>
      fn({
        _id: "t2",
        timestamp: Date.now(),
        serviceName: "Beta",
        type: "UNSUBSCRIBE",
        amount: 0,
      })
    );
    await waitFor(() => expect(screen.getByText("Beta")).toBeInTheDocument());
  });
});
