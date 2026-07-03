import type { Service } from "@/types";

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const services: Service[] = [
  {
    slug: "bridal-makeup",
    name: "Bridal Makeup",
    shortDescription:
      "Complete bridal transformation with premium HD products for your big day.",
    description:
      "Your wedding day deserves nothing less than perfection. This complete bridal package covers everything from a flawless long-wear HD base to intricate eye looks that complement your bridal outfit and jewellery. Includes a detailed consultation before the wedding to plan your look, plus a touch-up kit to keep you photo-ready through every ritual.",
    price: 15000,
    priceLabel: "Starting at",
    durationMinutes: 180,
    features: [
      "Pre-wedding consultation & look planning",
      "Premium HD long-wear base (MAC / Huda / NARS)",
      "Luxury lashes & waterproof finish",
      "Hairstyle setting with accessories",
      "Dupatta / veil setting",
      "Touch-up kit included",
      "Trial session available",
    ],
    images: [
      img("photo-1519699047748-de8e457a634e"),
      img("photo-1457972729786-0411a3b2b626"),
    ],
    isFeatured: true,
  },
  {
    slug: "hd-airbrush-makeup",
    name: "HD Airbrush Makeup",
    shortDescription:
      "Feather-light, camera-perfect airbrush finish that lasts 12+ hours.",
    description:
      "Airbrush makeup delivers an ultra-smooth, poreless finish that looks flawless in person and under 4K cameras. The fine mist application feels weightless on the skin and stays intact through tears, hugs, and hours of celebration — the top choice for brides who want that magazine-cover finish.",
    price: 12000,
    priceLabel: "Starting at",
    durationMinutes: 150,
    features: [
      "Temptu / Dinair professional airbrush system",
      "Poreless 4K camera-ready finish",
      "12+ hours smudge-proof wear",
      "Sweat & tear resistant",
      "Includes lashes and hairstyling",
    ],
    images: [
      img("photo-1526045478516-99145907023c"),
      img("photo-1596704017254-9b121068fb31"),
    ],
    isFeatured: true,
  },
  {
    slug: "reception-makeup",
    name: "Reception Makeup",
    shortDescription:
      "Glamorous evening looks with bold eyes and a radiant glow.",
    description:
      "Reception calls for glamour — deeper tones, bold eyes, and a luminous glow that shines under evening lights. Designed to photograph beautifully with your reception gown or saree, this look transitions perfectly from the stage to the dance floor.",
    price: 8000,
    priceLabel: "Starting at",
    durationMinutes: 120,
    features: [
      "Glam HD base with highlight & contour",
      "Bold smokey or glitter eye look",
      "Premium lashes",
      "Hairstyle with setting spray hold",
      "Saree / gown draping assistance",
    ],
    images: [
      img("photo-1529626455594-4ff0802cfb7e"),
      img("photo-1560066984-138dadb4c035"),
    ],
    isFeatured: true,
  },
  {
    slug: "engagement-makeup",
    name: "Engagement Makeup",
    shortDescription:
      "Soft, romantic looks that let your natural beauty shine through.",
    description:
      "Engagement looks are all about soft romance — dewy skin, subtle shimmer, and shades that photograph beautifully in daylight. Ideal for engagement ceremonies, ring exchanges, and save-the-date shoots.",
    price: 7000,
    priceLabel: "Starting at",
    durationMinutes: 90,
    features: [
      "Dewy natural-glow base",
      "Soft glam eye look",
      "Natural-finish lashes",
      "Simple elegant hairstyling",
    ],
    images: [
      img("photo-1508214751196-bcfd4ca60f91"),
      img("photo-1512496015851-a90fb38ba796"),
    ],
    isFeatured: false,
  },
  {
    slug: "party-makeup",
    name: "Party Makeup",
    shortDescription:
      "Quick glam for birthdays, festivals, and special evenings out.",
    description:
      "Look your best for any celebration — birthdays, anniversaries, Onam, festive parties, or a night out. A quick but complete glam session tailored to your outfit and the occasion.",
    price: 4500,
    priceLabel: "Starting at",
    durationMinutes: 60,
    features: [
      "Long-wear party base",
      "Eye look of your choice",
      "Lashes included",
      "Quick hairstyling",
    ],
    images: [
      img("photo-1534528741775-53994a69daeb"),
      img("photo-1522337660859-02fbefca4702"),
    ],
    isFeatured: false,
  },
];

export const featuredServices = services.filter((s) => s.isFeatured);

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
