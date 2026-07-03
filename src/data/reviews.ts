import type { Review } from "@/types";

export const reviews: Review[] = [
  {
    customerName: "Anjali Menon",
    rating: 5,
    message:
      "Meera made my wedding day absolutely magical! The makeup lasted from 6 AM muhurtham to the evening reception without a single touch-up. Everyone kept asking who did my makeup!",
    serviceName: "Bridal Makeup",
    isFeatured: true,
  },
  {
    customerName: "Fathima Nazrin",
    rating: 5,
    message:
      "She understood exactly the look I wanted for my nikah — elegant and modest but glowing. The airbrush finish looked flawless in every single photo. Highly recommend!",
    serviceName: "HD Airbrush Makeup",
    isFeatured: true,
  },
  {
    customerName: "Sneha Thomas",
    rating: 5,
    message:
      "Booked her for my engagement and immediately booked again for the wedding. Very professional, arrives on time, and the products she uses are all premium brands.",
    serviceName: "Engagement Makeup",
    isFeatured: true,
  },
  {
    customerName: "Divya Suresh",
    rating: 4,
    message:
      "Lovely reception look, exactly like the reference photo I showed. The hairstyle held perfectly all evening.",
    serviceName: "Reception Makeup",
    isFeatured: false,
  },
  {
    customerName: "Lakshmi Nair",
    rating: 5,
    message:
      "Did makeup for me and my two daughters for a family wedding. All three looks were different and suited each of us beautifully. Great value.",
    serviceName: "Party Makeup",
    isFeatured: false,
  },
];

export const featuredReviews = reviews.filter((r) => r.isFeatured);

export const averageRating =
  Math.round(
    (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10
  ) / 10;
