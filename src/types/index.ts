// Shapes intentionally mirror the future Mongoose schemas (see PROJECT_PLAN.md)
// so swapping dummy data for MongoDB queries requires no component changes.

export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  priceLabel: string;
  durationMinutes: number;
  features: string[];
  images: string[];
  isFeatured: boolean;
}

export interface AddOn {
  name: string;
  price: number;
  description?: string;
  /** Empty/undefined = available on all services */
  serviceSlugs?: string[];
}

export interface Reel {
  url: string;
  reelId: string;
  serviceSlug: string;
  title: string;
}

export type PortfolioCategory =
  | "bridal"
  | "reception"
  | "engagement"
  | "party"
  | "photoshoot";

export interface PortfolioItem {
  title: string;
  category: PortfolioCategory;
  image: string;
  isFeatured: boolean;
}

export interface Review {
  customerName: string;
  rating: number;
  message: string;
  serviceName?: string;
  isFeatured: boolean;
}

export interface Faq {
  question: string;
  answer: string;
}

export type DayStatus = "available" | "booked" | "holiday" | "partially_booked";

export interface AvailabilityEntry {
  date: string; // "YYYY-MM-DD"
  status: DayStatus;
  note?: string;
  maxBookings?: number;
  bookedCount?: number;
}
