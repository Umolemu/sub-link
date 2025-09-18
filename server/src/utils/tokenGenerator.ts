import jwt from "jsonwebtoken";
import { User } from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const generateToken = async (msisdn: string): Promise<string> => {
  const user = await User.findOne({ msisdn }).lean();
  const isAdmin = user?.isAdmin === true;
  return jwt.sign({ msisdn, isAdmin }, JWT_SECRET, { expiresIn: "1h" });
};
