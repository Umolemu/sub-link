import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
vi.mock("../Client/Client", () => {
  const mockClient = { get: vi.fn(), post: vi.fn(), delete: vi.fn() };
  return {
    Client: mockClient,
    extractErrorMessage: (_e: unknown, fb = "Request failed") => fb,
  };
});
import { Client as MockClient } from "../Client/Client";
import { requestOtp, verifyOtp } from "./Otp";

describe("OTP API", () => {
  const postSpy = MockClient.post as unknown as ReturnType<typeof vi.fn>;
  const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

  beforeEach(() => {
    postSpy.mockReset();
    setItemSpy.mockReset();
  });
  afterEach(() => vi.restoreAllMocks());

  it("requestOtp returns success on 200", async () => {
    postSpy.mockResolvedValueOnce({ data: { message: "sent" } });
    const res = await requestOtp("234");
    expect(res.success).toBe(true);
    expect(postSpy).toHaveBeenCalledWith("/auth/send-otp", { msisdn: "234" });
  });

  it("requestOtp returns failure on error", async () => {
    postSpy.mockRejectedValueOnce(new Error("boom"));
    const res = await requestOtp("234");
    expect(res.success).toBe(false);
  });

  it("verifyOtp stores token and returns success", async () => {
    postSpy.mockResolvedValueOnce({ data: { token: "tok" } });
    const res = await verifyOtp("234", "123456");
    expect(res.success).toBe(true);
    expect(window.localStorage.getItem("auth_token")).toBe("tok");
    expect(postSpy).toHaveBeenCalledWith("/auth/verify-otp", {
      msisdn: "234",
      otp: "123456",
    });
  });

  it("verifyOtp returns failure on error", async () => {
    postSpy.mockRejectedValueOnce(new Error("bad"));
    const res = await verifyOtp("234", "123456");
    expect(res.success).toBe(false);
  });
});
