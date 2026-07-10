import { Metadata } from "next";
import { getSettings } from "@/actions/settings";
import AboutSection from "@/components/home/AboutSection";
import FaqSection from "@/components/home/FaqSection";
import { getFaqs } from "@/actions/faqs";

export const metadata: Metadata = {
  title: "About | Makeup Artist",
  description: "Learn more about our makeup artist.",
};

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

export default async function AboutPage() {
  const [settings, faqs] = await Promise.all([
    getSettings().catch(() => null),
    getFaqs(true).catch(() => []),
  ]);
  const artistData = formatArtistData(settings);

  return (
    <div className="flex flex-col">
      <div className="min-h-[80vh] flex flex-col justify-center">
        <AboutSection artistData={artistData} />
      </div>
      <FaqSection faqsData={faqs} />
    </div>
  );
}
