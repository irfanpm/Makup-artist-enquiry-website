import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IInstagramVideo extends Document {
  url: string;
  reelId: string;
  serviceId: Types.ObjectId;
  title?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const InstagramVideoSchema = new Schema<IInstagramVideo>(
  {
    url: { type: String, required: true },
    reelId: { type: String, required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    title: String,
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

InstagramVideoSchema.index({ serviceId: 1, sortOrder: 1 });

const InstagramVideo: Model<IInstagramVideo> =
  mongoose.models.InstagramVideo ||
  mongoose.model<IInstagramVideo>("InstagramVideo", InstagramVideoSchema);

export default InstagramVideo;
