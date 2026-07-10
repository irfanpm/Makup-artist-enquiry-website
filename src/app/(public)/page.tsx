import Hero from "@/components/home/Hero";
import FeaturedServices from "@/components/home/FeaturedServices";
import StatsStrip from "@/components/home/StatsStrip";
import ReviewsSection from "@/components/home/ReviewsSection";

import { getSettings } from "@/actions/settings";
import { getServices } from "@/actions/services";
import { getReviews } from "@/actions/reviews";

function formatArtistData(settings: any) {
  if (!settings) return undefined;
  return {
    name: settings.artistName,
    title: settings.tagline || "Makeup Artist",
    tagline: settings.tagline || "Making your special day flawless",
    bio: settings.bio ? settings.bio.split("\n") : [],
    yearsExperience: settings.yearsExperience || 0,
    bridesCount: 500,
    rating: 4.9,
    reviewCount: 120,
    specializations: settings.specializations || [],
    certifications: settings.certifications || [],
    awards: settings.awards || [],
    whatsappNumber: settings.whatsappNumber,
    phone: settings.phone || "",
    email: settings.email || "",
    instagramUrl: settings.instagramUrl || "",
    youtubeUrl: settings.youtubeUrl || "",
    facebookUrl: settings.facebookUrl || "",
    studioAddress: settings.studioAddress || "",
    googleMapsEmbedUrl: settings.googleMapsEmbedUrl || "",
    heroImage: settings.heroImage?.url || "",
    profileImage: settings.profileImage?.url || "",
  };
}

export default async function HomePage() {
  const [settings, services, reviews] = await Promise.all([
    getSettings().catch(() => null),
    getServices().then((res) => res.filter((s: any) => s.isActive && s.isFeatured)).catch(() => []),
    getReviews(true, true).catch(() => []), // fetch approved + featured reviews
  ]);

  const artistData = formatArtistData(settings);

  return (
    <>
      <Hero artistData={artistData} />
      <FeaturedServices servicesData={services} />
      <StatsStrip artistData={artistData} />
      <ReviewsSection reviewsData={reviews} />
    </>
  );
}
