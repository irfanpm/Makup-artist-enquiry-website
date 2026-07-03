import type { Reel } from "@/types";

// ⚠️ BEFORE THE CLIENT DEMO: replace these reelIds with REAL public Instagram
// reel IDs (from the client's Instagram, or any public makeup artist reel).
// A reel URL like https://www.instagram.com/reel/C8abcDEfGhi/ has reelId "C8abcDEfGhi".
// Invalid IDs will show Instagram's "page isn't available" box inside the embed.

export const reels: Reel[] = [
  {
    url: "https://www.instagram.com/reel/REPLACE_ME_1/",
    reelId: "REPLACE_ME_1",
    serviceSlug: "bridal-makeup",
    title: "Traditional Kerala Bridal Look",
  },
  {
    url: "https://www.instagram.com/reel/REPLACE_ME_2/",
    reelId: "REPLACE_ME_2",
    serviceSlug: "bridal-makeup",
    title: "HD Bridal Transformation",
  },
  {
    url: "https://www.instagram.com/reel/REPLACE_ME_3/",
    reelId: "REPLACE_ME_3",
    serviceSlug: "bridal-makeup",
    title: "Muslim Bridal Makeup",
  },
  {
    url: "https://www.instagram.com/reel/REPLACE_ME_4/",
    reelId: "REPLACE_ME_4",
    serviceSlug: "reception-makeup",
    title: "Reception Glam Look",
  },
  {
    url: "https://www.instagram.com/reel/REPLACE_ME_5/",
    reelId: "REPLACE_ME_5",
    serviceSlug: "hd-airbrush-makeup",
    title: "Airbrush Finish Close-up",
  },
  {
    url: "https://www.instagram.com/reel/REPLACE_ME_6/",
    reelId: "REPLACE_ME_6",
    serviceSlug: "engagement-makeup",
    title: "Soft Glam Engagement Look",
  },
];

export function reelsForService(slug: string) {
  return reels.filter((r) => r.serviceSlug === slug);
}
