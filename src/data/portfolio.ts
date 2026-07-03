import type { PortfolioItem } from "@/types";

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const portfolio: PortfolioItem[] = [
  { title: "Kerala Traditional Bride", category: "bridal", image: img("photo-1487412947147-5cebf100ffc2"), isFeatured: true },
  { title: "Classic Bridal Glow", category: "bridal", image: img("photo-1544005313-94ddf0286df2"), isFeatured: true },
  { title: "Golden Hour Bride", category: "bridal", image: img("photo-1519699047748-de8e457a634e"), isFeatured: false },
  { title: "Veil Portrait", category: "bridal", image: img("photo-1457972729786-0411a3b2b626"), isFeatured: false },
  { title: "Evening Reception Glam", category: "reception", image: img("photo-1492106087820-71f1a00d2b11"), isFeatured: true },
  { title: "Smokey Eye Reception", category: "reception", image: img("photo-1529626455594-4ff0802cfb7e"), isFeatured: false },
  { title: "Soft Engagement Look", category: "engagement", image: img("photo-1531123897727-8f129e1688ce"), isFeatured: true },
  { title: "Ring Ceremony Glow", category: "engagement", image: img("photo-1508214751196-bcfd4ca60f91"), isFeatured: false },
  { title: "Festive Party Look", category: "party", image: img("photo-1580618672591-eb180b1a973f"), isFeatured: true },
  { title: "Birthday Glam", category: "party", image: img("photo-1534528741775-53994a69daeb"), isFeatured: false },
  { title: "Editorial Photoshoot", category: "photoshoot", image: img("photo-1503104834685-7205e8607eb9"), isFeatured: true },
  { title: "Studio Beauty Shoot", category: "photoshoot", image: img("photo-1526045478516-99145907023c"), isFeatured: false },
];

export const featuredPortfolio = portfolio.filter((p) => p.isFeatured);
