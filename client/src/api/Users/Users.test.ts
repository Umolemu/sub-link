import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
vi.mock("../Client/Client", () => {
  const mockClient = { get: vi.fn(), post: vi.fn(), delete: vi.fn() };
  return {
    Client: mockClient,
    extractErrorMessage: (_e: unknown, fb = "Request failed") => fb,
  };
});
import { Client as MockClient } from "../Client/Client";
import { getUsers, getUserDetail, deleteUser } from "./Users";

describe("Users API", () => {
  const getSpy = MockClient.get as unknown as ReturnType<typeof vi.fn>;
  const deleteSpy = MockClient.delete as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getSpy.mockReset();
    deleteSpy.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getUsers returns data on success", async () => {
    getSpy.mockResolvedValueOnce({
      data: [
        {
          msisdn: "123",
          subscriptionCount: 1,
          monthlyRevenue: 5,
          createdAt: new Date().toISOString(),
          isAdmin: false,
        },
      ],
    });
    const res = await getUsers();
    expect(res.length).toBe(1);
    expect(getSpy).toHaveBeenCalledWith("/users");
  });

  it("getUsers returns [] on error", async () => {
    getSpy.mockRejectedValueOnce(new Error("network"));
    const res = await getUsers();
    expect(res).toEqual([]);
  });

  it("getUserDetail returns object on success", async () => {
    const detail = {
      msisdn: "123",
      activeSubscriptions: [],
      monthlyRevenue: 0,
      createdAt: new Date().toISOString(),
      isAdmin: false,
    };
    getSpy.mockResolvedValueOnce({ data: detail });
    const res = await getUserDetail("123");
    expect(res).toEqual(detail);
    expect(getSpy).toHaveBeenCalledWith("/users/123");
  });

  it("getUserDetail returns null on error", async () => {
    getSpy.mockRejectedValueOnce(new Error("boom"));
    const res = await getUserDetail("123");
    expect(res).toBeNull();
  });

  it("deleteUser returns true on success", async () => {
    deleteSpy.mockResolvedValueOnce({});
    const ok = await deleteUser("123");
    expect(ok).toBe(true);
    expect(deleteSpy).toHaveBeenCalledWith("/users/123");
  });

  it("deleteUser returns false on error", async () => {
    deleteSpy.mockRejectedValueOnce(new Error("nope"));
    const ok = await deleteUser("123");
    expect(ok).toBe(false);
  });
});
