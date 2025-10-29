import mongoose, { Schema, Document } from "mongoose";
import { randomUUID } from 'crypto';

export interface IPromo extends Document {
  code: string;
  discountType: "PERCENT" | "FLAT";
  value: number;
  createdAt?: Date;
  isUsed?: boolean;
  usedAt?: Date | null;
  usedBy?: string | null;
}

const generatePromoCode = (): string => {
  // Use crypto.randomUUID instead of 'uuid' package to avoid ESM/CommonJS interop issues
  return randomUUID().replace(/[^a-zA-Z0-9]/g, "").substring(0, 6).toUpperCase();
};

const promoSchema = new Schema<IPromo>({
  code: {
    type: String,
    required: true,
    unique: true,
    default: generatePromoCode, // auto-generate random code
  },
  discountType: {
    type: String,
    enum: ["PERCENT", "FLAT"],
    required: true,
  },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  isUsed: { type: Boolean, default: false },
  usedAt: { type: Date, default: null },
  usedBy: { type: String, default: null },
});

export default mongoose.model<IPromo>("Promo", promoSchema);
