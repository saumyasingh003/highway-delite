import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userName: string;
  email: string;
  experienceId: string;
  date: string;
  time: string;
  totalPrice: number;
  promoCode?: string;
}

const bookingSchema = new Schema<IBooking>({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  experienceId: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  promoCode: { type: String },
});

export default mongoose.model<IBooking>("Booking", bookingSchema);
