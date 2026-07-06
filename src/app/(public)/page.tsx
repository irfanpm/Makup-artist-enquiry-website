import Hero from "@/components/home/Hero";
import MarqueeRibbon from "@/components/home/MarqueeRibbon";
import StatsStrip from "@/components/home/StatsStrip";
import AboutSection from "@/components/home/AboutSection";
import BrandsStrip from "@/components/home/BrandsStrip";
import FeaturedServices from "@/components/home/FeaturedServices";
import BeforeAfter from "@/components/home/BeforeAfter";
import HowItWorks from "@/components/home/HowItWorks";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import WhyChooseMe from "@/components/home/WhyChooseMe";
import ReviewsSection from "@/components/home/ReviewsSection";
import CtaBanner from "@/components/home/CtaBanner";
import FaqSection from "@/components/home/FaqSection";
import ContactSection from "@/components/home/ContactSection";

import { getSettings } from "@/actions/settings";
import { getServices } from "@/actions/services";
import { getPortfolioItems } from "@/actions/portfolio";
import { getReviews } from "@/actions/reviews";
import { getFaqs } from "@/actions/faqs";

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
  const [settings, services, portfolio, reviews, faqs] = await Promise.all([
    getSettings().catch(() => null),
    getServices().then((res) => res.filter((s: any) => s.isActive && s.isFeatured)).catch(() => []),
    getPortfolioItems(undefined, true).catch(() => []), // fetch featured portfolio items
    getReviews(true, true).catch(() => []), // fetch approved + featured reviews
    getFaqs(true).catch(() => []), // fetch active FAQs
  ]);

  const artistData = formatArtistData(settings);

  return (
    <>
      <Hero artistData={artistData} />
      <MarqueeRibbon />
      <StatsStrip artistData={artistData} />
      <AboutSection artistData={artistData} />
      <BrandsStrip />
      <FeaturedServices servicesData={services} />
      <BeforeAfter beforeImage={settings?.beforeImage?.url} afterImage={settings?.afterImage?.url} />
      <HowItWorks />
      <PortfolioPreview portfolioData={portfolio} />
      <WhyChooseMe />
      <ReviewsSection reviewsData={reviews} />
      <CtaBanner />
      <FaqSection faqsData={faqs} />
      <ContactSection artistData={artistData} />
    </>
  );
}
