import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IEnquiryAddOn {
  name: string;
  price: number;
}

export interface IEnquiry extends Document {
  serviceId?: Types.ObjectId;
  serviceName?: string;
  addOns: IEnquiryAddOn[];
  totalPrice?: number;
  eventDate?: string;
  location?: string;
  personCount?: number;
  referenceReelUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    serviceName: String,
    addOns: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: Number,
    eventDate: String,
    location: String,
    personCount: Number,
    referenceReelUrl: String,
  },
  { timestamps: true }
);

const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export default Enquiry;
