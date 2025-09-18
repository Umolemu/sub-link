import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
vi.mock("../Client/Client", () => {
  const mockClient = { get: vi.fn(), post: vi.fn(), delete: vi.fn() };
  return {
    Client: mockClient,
    extractErrorMessage: (_e: unknown, fb = "Request failed") => fb,
  };
});
import { Client as MockClient } from "../Client/Client";
import { getServices, createService, deleteService } from "./Services";

describe("Services API", () => {
  const getSpy = MockClient.get as unknown as ReturnType<typeof vi.fn>;
  const postSpy = MockClient.post as unknown as ReturnType<typeof vi.fn>;
  const deleteSpy = MockClient.delete as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getSpy.mockReset();
    postSpy.mockReset();
    deleteSpy.mockReset();
  });
  afterEach(() => vi.restoreAllMocks());

  it("getServices returns list", async () => {
    getSpy.mockResolvedValueOnce({
      data: [
        {
          _id: "1",
          name: "S",
          description: "d",
          price: 1,
          category: "Phone",
          icon: "Phone",
        },
      ],
    });
    const list = await getServices();
    expect(list.length).toBe(1);
    expect(getSpy).toHaveBeenCalledWith("/services");
  });

  it("getServices returns [] on error", async () => {
    getSpy.mockRejectedValueOnce(new Error("fail"));
    const list = await getServices();
    expect(list).toEqual([]);
  });

  it("createService returns created item", async () => {
    const payload = {
      name: "S",
      description: "d",
      price: 1,
      category: "Phone",
      icon: "Phone",
    };
    postSpy.mockResolvedValueOnce({ data: { _id: "1", ...payload } });
    const item = await createService(payload as any);
    expect(item?._id).toBe("1");
    expect(postSpy).toHaveBeenCalledWith("/services", payload);
  });

  it("createService returns null on error", async () => {
    postSpy.mockRejectedValueOnce(new Error("nope"));
    const item = await createService({} as any);
    expect(item).toBeNull();
  });

  it("deleteService returns true on success", async () => {
    deleteSpy.mockResolvedValueOnce({});
    const ok = await deleteService("1");
    expect(ok).toBe(true);
    expect(deleteSpy).toHaveBeenCalledWith("/services/1");
  });

  it("deleteService returns false on error", async () => {
    deleteSpy.mockRejectedValueOnce(new Error("boom"));
    const ok = await deleteService("1");
    expect(ok).toBe(false);
  });
});
