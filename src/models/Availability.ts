import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAvailability extends Document {
  date: string; // "YYYY-MM-DD"
  status: "available" | "booked" | "holiday";
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AvailabilitySchema = new Schema<IAvailability>(
  {
    date: { type: String, required: true, unique: true },
    status: {
      type: String,
      required: true,
      enum: ["available", "booked", "holiday"],
    },
    note: String,
  },
  { timestamps: true }
);

const Availability: Model<IAvailability> =
  mongoose.models.Availability ||
  mongoose.model<IAvailability>("Availability", AvailabilitySchema);

export default Availability;
