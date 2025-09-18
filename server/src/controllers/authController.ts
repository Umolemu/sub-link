import { type Request, type Response } from "express";
import { sendOtp, verifyOtp } from "../services/authService";
import { generateToken } from "../utils/tokenGenerator";
import type { AuthRequest } from "../middleware/authMiddleware";

export async function sendOtpController(req: Request, res: Response) {
  try {
    const { msisdn } = req.body;

    if (!msisdn) {
      return res.status(400).json({ error: "MSISDN is required" });
    }

    await sendOtp(msisdn);
    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("sendOtpController error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function verifyOtpController(req: Request, res: Response) {
  try {
    const { msisdn, otp } = req.body;

    if (!msisdn || !otp) {
      return res.status(400).json({ error: "MSISDN and OTP are required" });
    }

    const token = await verifyOtp(msisdn, otp);

    if (!token) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    return res.json({ token });
  } catch (error) {
    console.error("verifyOtpController error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function refreshTokenController(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.msisdn)
      return res.status(401).json({ error: "Unauthorized" });
    const token = await generateToken(req.user.msisdn);
    return res.json({ token });
  } catch (error) {
    console.error("refreshTokenController error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
