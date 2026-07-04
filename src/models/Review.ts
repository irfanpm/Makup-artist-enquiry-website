import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IImage } from "./Settings";

export interface IReview extends Document {
  customerName: string;
  rating: number;
  message: string;
  customerImage?: IImage;
  serviceId?: Types.ObjectId;
  isApproved: boolean;
  isFeatured: boolean;
  source: "admin" | "public";
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>({
  url: { type: String, required: true },
  publicId: String,
});

const ReviewSchema = new Schema<IReview>(
  {
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
    customerImage: ImageSchema,
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    source: { type: String, enum: ["admin", "public"], default: "public" },
  },
  { timestamps: true }
);

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
