import type {
  RequestOtpResponse,
  VerifyOtpResponse,
} from "../../types/Otp/otp";
import { Client, extractErrorMessage } from "../Client/Client";

export async function requestOtp(msisdn: string): Promise<RequestOtpResponse> {
  try {
    const res = await Client.post<RequestOtpResponse>("/auth/send-otp", {
      msisdn,
    });
    return { success: true, message: res.data?.message || "OTP sent" };
  } catch (e) {
    return {
      success: false,
      message: extractErrorMessage(e, "Failed to send OTP"),
    };
  }
}

export async function verifyOtp(
  msisdn: string,
  otp: string
): Promise<VerifyOtpResponse> {
  try {
    const res = await Client.post<VerifyOtpResponse>("/auth/verify-otp", {
      msisdn,
      otp,
    });
    const token = res.data?.token as string | undefined;
    if (token) {
      localStorage.setItem("auth_token", token);
      return { success: true, message: "OTP verified", token };
    }
    return { success: false, message: "Missing token in response" };
  } catch (e) {
    return {
      success: false,
      message: extractErrorMessage(e, "OTP verification failed"),
    };
  }
}
