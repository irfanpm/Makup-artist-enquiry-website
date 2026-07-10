import mongoose, { Schema, Document, Model } from "mongoose";
import { IImage } from "./Settings";

export interface IPortfolio extends Document {
  title?: string;
  category: "bridal" | "reception" | "engagement" | "party" | "photoshoot";
  image: IImage;
  serviceSlug?: string;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>({
  url: { type: String, required: true },
  publicId: String,
});

const PortfolioSchema = new Schema<IPortfolio>(
  {
    title: String,
    category: {
      type: String,
      required: true,
      enum: ["bridal", "reception", "engagement", "party", "photoshoot"],
    },
    image: { type: ImageSchema, required: true },
    serviceSlug: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio || mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);

export default Portfolio;
