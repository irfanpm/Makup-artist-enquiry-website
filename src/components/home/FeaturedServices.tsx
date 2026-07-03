import { featuredServices } from "@/data/services";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function FeaturedServices() {
  return (
    <section className="bg-muted/60 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Services"
          title="Signature Makeup Services"
          subtitle="Every look is customized to your skin, outfit, and occasion — with premium products only."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {featuredServices.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.15}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/services" variant="outline">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}
