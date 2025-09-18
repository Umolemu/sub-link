import { Router } from "express";
import {
  sendOtpController,
  verifyOtpController,
  refreshTokenController,
} from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";
import { otpRateLimiter } from "../middleware/otpRateLimiter";

const authRoutes = Router();

authRoutes.post("/send-otp", otpRateLimiter(), sendOtpController);
authRoutes.post("/verify-otp", verifyOtpController);
authRoutes.post("/refresh", authenticate, refreshTokenController);

export default authRoutes;
