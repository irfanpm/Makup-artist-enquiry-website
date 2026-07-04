import type { Metadata } from "next";
import ReelSearch from "@/components/services/ReelSearch";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Instagram Look Finder — Makeup Packages",
  description:
    "Found a makeup look you love on our Instagram feed? Search for the reel URL or style name to discover the exact service package and customizations used.",
};

export default function ReelsSearchPage() {
  return (
    <div className="py-14 md:py-20 bg-gradient-to-b from-background via-muted/10 to-background min-h-screen">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Instagram Look Finder"
          title="Find the Service Behind the Look"
          subtitle="Spotted a makeup style you love on our Instagram? Paste the reel URL or search keywords to instantly find the exact package, addons, and pricing."
        />
        
        <ReelSearch />
      </div>
    </div>
  );
}
