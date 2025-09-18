import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
vi.mock("../Client/Client", () => {
  const mockClient = { get: vi.fn(), post: vi.fn(), delete: vi.fn() };
  return {
    Client: mockClient,
    extractErrorMessage: (_e: unknown, fb = "Request failed") => fb,
  };
});
import { Client as MockClient } from "../Client/Client";
import {
  getUserSubscriptions,
  subscribe,
  unsubscribe,
  unsubscribeByAdmin,
} from "./Subscriptions";

describe("Subscriptions API", () => {
  const getSpy = MockClient.get as unknown as ReturnType<typeof vi.fn>;
  const postSpy = MockClient.post as unknown as ReturnType<typeof vi.fn>;
  const deleteSpy = MockClient.delete as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getSpy.mockReset();
    postSpy.mockReset();
    deleteSpy.mockReset();
  });
  afterEach(() => vi.restoreAllMocks());

  it("getUserSubscriptions returns list", async () => {
    getSpy.mockResolvedValueOnce({
      data: [
        {
          serviceId: "1",
          name: "S",
          price: 1,
          category: "Phone",
          icon: "Phone",
          subscribedAt: new Date().toISOString(),
        },
      ],
    });
    const list = await getUserSubscriptions();
    expect(list.length).toBe(1);
    expect(getSpy).toHaveBeenCalledWith("/subscriptions");
  });

  it("subscribe returns item", async () => {
    postSpy.mockResolvedValueOnce({
      data: {
        serviceId: "1",
        name: "S",
        price: 1,
        category: "Phone",
        icon: "Phone",
        subscribedAt: new Date().toISOString(),
      },
    });
    const item = await subscribe("1");
    expect(item?.serviceId).toBe("1");
    expect(postSpy).toHaveBeenCalledWith("/subscriptions", { serviceId: "1" });
  });

  it("unsubscribe returns true on success", async () => {
    deleteSpy.mockResolvedValueOnce({});
    const ok = await unsubscribe("1");
    expect(ok).toBe(true);
    expect(deleteSpy).toHaveBeenCalledWith("/subscriptions/1");
  });

  it("unsubscribeByAdmin uses admin route", async () => {
    deleteSpy.mockResolvedValueOnce({});
    const ok = await unsubscribeByAdmin("1", "234");
    expect(ok).toBe(true);
    expect(deleteSpy).toHaveBeenCalledWith("/subscriptions/admin/234/1");
  });
});
