import { User } from "../models/userModel";
import { generateOtp } from "../utils/otpGenerator";
import { generateToken } from "../utils/tokenGenerator";

const OTP_EXPIRY_MINUTES = 5;

export async function sendOtp(msisdn: string): Promise<string> {
  const otp = generateOtp();

  let user = await User.findOne({ msisdn });
  if (!user) {
    user = new User({ msisdn });
  }

  user.otp = otp;
  user.otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  await user.save();

  console.log(`OTP for ${msisdn}: ${otp}`); // simulate SMS sending
  return otp;
}

export async function verifyOtp(
  msisdn: string,
  otp: string
): Promise<string | null> {
  const user = await User.findOne({ msisdn });

  if (!user || !user.otp || !user.otpExpires) return null;

  const now = new Date();
  if (user.otp === otp && user.otpExpires > now) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return await generateToken(msisdn);
  }

  return null;
}
