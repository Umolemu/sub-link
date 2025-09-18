import mongoose, { Document, Schema, Types } from "mongoose";

export type TransactionType = "SUBSCRIBE" | "UNSUBSCRIBE";

export interface ITransaction extends Document {
  msisdn: string;
  serviceId: Types.ObjectId;
  type: TransactionType;
  timestamp: Date;
  serviceName?: string;
  amount?: number;
}

const transactionSchema = new Schema<ITransaction>(
  {
    msisdn: { type: String, required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    type: { type: String, enum: ["SUBSCRIBE", "UNSUBSCRIBE"], required: true },
    timestamp: { type: Date, default: Date.now },
    serviceName: { type: String },
    amount: { type: Number },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);
