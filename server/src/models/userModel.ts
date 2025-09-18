import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  msisdn: string;
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
  isAdmin: boolean;
}

export interface UserWithStats {
  msisdn: string;
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
  subscriptionCount: number;
  monthlyRevenue: number;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>(
  {
    msisdn: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpires: { type: Date },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
