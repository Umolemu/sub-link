import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
vi.mock("../Client/Client", () => {
  const mockClient = { get: vi.fn(), post: vi.fn(), delete: vi.fn() };
  return {
    Client: mockClient,
    extractErrorMessage: (_e: unknown, fb = "Request failed") => fb,
  };
});
import { Client as MockClient } from "../Client/Client";
import { getUserTransactions, createTransaction } from "./Transactions";

describe("Transactions API", () => {
  const getSpy = MockClient.get as unknown as ReturnType<typeof vi.fn>;
  const postSpy = MockClient.post as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getSpy.mockReset();
    postSpy.mockReset();
  });
  afterEach(() => vi.restoreAllMocks());

  it("getUserTransactions returns list", async () => {
    getSpy.mockResolvedValueOnce({
      data: [
        {
          _id: "t1",
          type: "SUBSCRIBE",
          msisdn: "234",
          serviceId: "1",
          createdAt: new Date().toISOString(),
          serviceName: "S",
          amount: 1,
        },
      ],
    });
    const list = await getUserTransactions();
    expect(list.length).toBe(1);
    expect(getSpy).toHaveBeenCalledWith("/transactions");
  });

  it("createTransaction returns item", async () => {
    postSpy.mockResolvedValueOnce({
      data: {
        _id: "t1",
        type: "SUBSCRIBE",
        msisdn: "234",
        serviceId: "1",
        createdAt: new Date().toISOString(),
        serviceName: "S",
        amount: 1,
      },
    });
    const item = await createTransaction("234", "1", "SUBSCRIBE");
    expect(item?._id).toBe("t1");
    expect(postSpy).toHaveBeenCalledWith("/transactions", {
      msisdn: "234",
      serviceId: "1",
      type: "SUBSCRIBE",
    });
  });
});
