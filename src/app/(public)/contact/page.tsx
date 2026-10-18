import { Metadata } from "next";
import { getSettings } from "@/actions/settings";
import ContactSection from "@/components/home/ContactSection";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings().catch(() => null);
  const title = `Contact | ${settings?.artistName || "Makeup Artist"}`;
  const description = `Get in touch for bookings and enquiries with ${settings?.artistName || "our artist"}.`;

  return { title, description };
}

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

export default async function ContactPage() {
  const settings = await getSettings().catch(() => null);
  const artistData = formatArtistData(settings);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <ContactSection artistData={artistData} />
    </div>
  );
}
