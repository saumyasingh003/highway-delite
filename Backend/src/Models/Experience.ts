import mongoose, { Schema, Document } from "mongoose";

export interface ISlot {
  date: string;
  time: string;
  available: boolean;
}

export interface IExperience extends Document {
  title: string;
  description: string;
  location: string;
  price: number;
  image: string;
  slots: ISlot[];
}

const experienceSchema = new Schema<IExperience>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  slots: [
    {
      date: String,
      time: String,
      available: { type: Boolean, default: true },
    },
  ],
});

export default mongoose.model<IExperience>("Experience", experienceSchema);
