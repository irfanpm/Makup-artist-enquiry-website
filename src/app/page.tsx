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

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeRibbon />
      <StatsStrip />
      <AboutSection />
      <BrandsStrip />
      <FeaturedServices />
      <BeforeAfter />
      <HowItWorks />
      <PortfolioPreview />
      <WhyChooseMe />
      <ReviewsSection />
      <CtaBanner />
      <FaqSection />
      <ContactSection />
    </>
  );
}
