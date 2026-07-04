import mongoose, { Schema, Document, Model } from "mongoose";
import { IImage } from "./Settings";

export interface IService extends Document {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: number;
  priceLabel: string;
  durationMinutes?: number;
  features: string[];
  images: IImage[];
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>({
  url: { type: String, required: true },
  publicId: String,
});

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: String,
    description: String,
    price: { type: Number, required: true },
    priceLabel: { type: String, default: "Starting at" },
    durationMinutes: Number,
    features: [String],
    images: [ImageSchema],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
