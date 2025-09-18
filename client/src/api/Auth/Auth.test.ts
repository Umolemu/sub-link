import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
vi.mock("../Client/Client", () => {
  const mockClient = { get: vi.fn(), post: vi.fn(), delete: vi.fn() };
  return {
    Client: mockClient,
    extractErrorMessage: (_e: unknown, fb = "Request failed") => fb,
  };
});
import { Client as MockClient } from "../Client/Client";
import { refreshToken } from "./Auth";

describe("Auth API", () => {
  const postSpy = MockClient.post as unknown as ReturnType<typeof vi.fn>;
  const setItemSpy = vi.spyOn(window.localStorage.__proto__, "setItem");

  beforeEach(() => {
    postSpy.mockReset();
    setItemSpy.mockReset();
  });
  afterEach(() => vi.restoreAllMocks());

  it("refreshToken stores token on success", async () => {
    postSpy.mockResolvedValueOnce({ data: { token: "abc" } });
    const token = await refreshToken();
    expect(token).toBe("abc");
    expect(postSpy).toHaveBeenCalledWith("/auth/refresh", {});
    expect(setItemSpy).toHaveBeenCalledWith("auth_token", "abc");
  });

  it("refreshToken returns null on error", async () => {
    postSpy.mockRejectedValueOnce(new Error("fail"));
    const token = await refreshToken();
    expect(token).toBeNull();
  });
});
