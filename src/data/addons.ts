import type { AddOn } from "@/types";

export const addons: AddOn[] = [
  {
    name: "Hair Styling",
    price: 2000,
    description: "Bridal bun, curls, or braided styles with accessories",
  },
  {
    name: "Saree Draping",
    price: 1000,
    description: "Perfect pleats in Kerala, Bengali, or modern styles",
  },
  {
    name: "Nail Art",
    price: 1500,
    description: "Gel polish with bridal nail art designs",
  },
  {
    name: "Pre-Bridal Package",
    price: 5000,
    description: "Skin prep sessions in the week before the wedding",
    serviceSlugs: ["bridal-makeup", "hd-airbrush-makeup"],
  },
  {
    name: "Family Makeup (per person)",
    price: 2500,
    description: "Party makeup for mother, sisters, or bridesmaids",
  },
  {
    name: "Groom Makeup",
    price: 3000,
    description: "Natural grooming and camera-ready finish for the groom",
  },
];

/** Add-ons applicable to a given service (empty serviceSlugs = all services). */
export function addonsForService(slug: string) {
  return addons.filter(
    (a) => !a.serviceSlugs || a.serviceSlugs.length === 0 || a.serviceSlugs.includes(slug)
  );
}
