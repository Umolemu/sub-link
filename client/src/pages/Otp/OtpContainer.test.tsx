import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { OtpContainer } from "./OtpContainer";

vi.mock("../../api/Otp/Otp", () => ({
  verifyOtp: vi.fn(async () => ({
    success: true,
    token: "t",
    refreshToken: "r",
  })),
}));

describe("OtpContainer", () => {
  it("renders and submit otp", () => {
    render(
      <MemoryRouter>
        <OtpContainer msisdn="12345678" otp="123456" setOtp={() => {}} />
      </MemoryRouter>
    );
    const btn = screen.getByRole("button", { name: /verify & login/i });
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });
});
