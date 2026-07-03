import type { Metadata } from "next";
import { services } from "@/data/services";
import ServiceCard from "@/components/services/ServiceCard";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Makeup Services & Packages",
  description:
    "Bridal, HD airbrush, reception, engagement and party makeup packages. Customize with add-ons and enquire directly on WhatsApp.",
};

export default function ServicesPage() {
  return (
    <div className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Services"
          title="Makeup Services & Packages"
          subtitle="Choose a service to see full details, watch previous work, and build your own customized package."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}
