import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAddOn extends Document {
  name: string;
  price: number;
  description?: string;
  serviceIds: Types.ObjectId[];
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const AddOnSchema = new Schema<IAddOn>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    serviceIds: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const AddOn: Model<IAddOn> =
  mongoose.models.AddOn || mongoose.model<IAddOn>("AddOn", AddOnSchema);

export default AddOn;
