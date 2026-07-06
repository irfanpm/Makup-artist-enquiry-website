import mongoose, { Schema, Document, Model } from "mongoose";

export interface IImage {
  url: string;
  publicId?: string;
}

export interface ISettings extends Document {
  // Artist profile
  artistName: string;
  tagline?: string;
  bio?: string;
  yearsExperience?: number;
  specializations: string[];
  certifications: string[];
  awards: string[];
  logoImage?: IImage;
  heroImage?: IImage;
  profileImage?: IImage;
  beforeImage?: IImage;
  afterImage?: IImage;
  // Contact & social
  whatsappNumber: string;
  phone?: string;
  email?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  studioAddress?: string;
  googleMapsEmbedUrl?: string;
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: IImage;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>({
  url: { type: String, required: true },
  publicId: String,
});

const SettingsSchema = new Schema<ISettings>(
  {
    artistName: { type: String, required: true },
    tagline: String,
    bio: String,
    yearsExperience: Number,
    specializations: [String],
    certifications: [String],
    awards: [String],
    logoImage: ImageSchema,
    heroImage: ImageSchema,
    profileImage: ImageSchema,
    beforeImage: ImageSchema,
    afterImage: ImageSchema,
    whatsappNumber: { type: String, required: true },
    phone: String,
    email: String,
    instagramUrl: String,
    youtubeUrl: String,
    facebookUrl: String,
    studioAddress: String,
    googleMapsEmbedUrl: String,
    seoTitle: String,
    seoDescription: String,
    ogImage: ImageSchema,
  },
  { timestamps: true }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
