import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateServiceDTO = {
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
};

export interface ServiceWithUserCountDTO {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
  userCount: number;
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>("Service", serviceSchema);
