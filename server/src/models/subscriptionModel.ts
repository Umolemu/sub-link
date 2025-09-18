import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISubscription extends Document {
  serviceId: Types.ObjectId;
  msisdn: string;
  subscribedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    msisdn: { type: String, required: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
