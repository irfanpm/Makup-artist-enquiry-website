import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServices, getServiceBySlug } from "@/actions/services";
import { getAddOns } from "@/actions/addons";
import { getReels } from "@/actions/reels";
import { getSettings } from "@/actions/settings";
import { getAvailabilityEntries } from "@/actions/availability";
import { formatPrice, formatDuration } from "@/lib/utils";
import PackageBuilder from "@/components/services/PackageBuilder";
import ReelEmbed from "@/components/services/ReelEmbed";
import ServiceCard from "@/components/services/ServiceCard";
import SectionHeading from "@/components/ui/SectionHeading";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices().catch(() => []);
  return services.map((s: any) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug).catch(() => null);
  if (!service) return {};
  return {
    title: `${service.name} — Prices & Packages`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug).catch(() => null);
  if (!service || !service.isActive) notFound();

  // Load add-ons, reels, settings, other services, and availability in parallel
  const [addons, reels, settings, allServices, availability] = await Promise.all([
    getAddOns().then((res) =>
      res.filter(
        (a: any) =>
          !a.serviceSlugs ||
          a.serviceSlugs.length === 0 ||
          a.serviceSlugs.includes(slug)
      )
    ).catch(() => []),
    getReels().then((res) => res.filter((r: any) => r.serviceSlug === slug)).catch(() => []),
    getSettings().catch(() => null),
    getServices().then((res) => res.filter((s: any) => s.isActive && s.slug !== slug).slice(0, 3)).catch(() => []),
    getAvailabilityEntries().catch(() => []),
  ]);

  const whatsappNumber = settings?.whatsappNumber;

  // Adapt database service structure to expected front-end structure if needed
  // If service has images, make sure it has at least one image or fallback
  const serviceImages = service.images && service.images.length > 0
    ? service.images.map((img: any) => typeof img === "string" ? img : img.url)
    : ["/images/placeholder.jpg"];

  const serviceFeatures = service.features || [];

  const adaptedService = {
    ...service.toObject?.() || service,
    images: serviceImages,
    features: serviceFeatures,
  };

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Gallery + summary */}
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            {serviceImages.map((img: string, i: number) => (
              <div
                key={img + i}
                className={
                  i === 0
                    ? "relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl"
                    : "relative aspect-[4/3] overflow-hidden rounded-2xl"
                }
              >
                <Image
                  src={img}
                  alt={`${service.name} — photo ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          <div>
            <h1 className="font-serif text-3xl font-semibold text-secondary md:text-4xl">
              {service.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <p className="text-foreground/60">
                {service.priceLabel || "Package starts at"}{" "}
                <span className="font-serif text-3xl font-bold text-primary">
                  {formatPrice(service.price)}
                </span>
              </p>
              <span className="rounded-full bg-muted px-4 py-1.5 text-xs font-semibold text-secondary">
                ⏱ {formatDuration(service.durationMinutes)}
              </span>
            </div>

            <p className="mt-5 leading-relaxed text-foreground/75">
              {service.description}
            </p>

            {serviceFeatures.length > 0 && (
              <>
                <p className="mb-3 mt-7 text-sm font-semibold uppercase tracking-widest text-secondary">
                  What&apos;s Included
                </p>
                <ul className="space-y-2.5">
                  {serviceFeatures.map((feature: string) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/75">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Package builder */}
        <div className="mt-14 md:mt-20">
          <PackageBuilder
            service={adaptedService}
            addons={addons}
            whatsappNumber={whatsappNumber}
            availability={availability}
          />
        </div>

        {/* Previous works — Instagram reels */}
        {reels.length > 0 && (
          <div className="mt-16 md:mt-24">
            <SectionHeading
              eyebrow="Previous Works"
              title={`${service.name} Transformations`}
              subtitle="Watch real looks from my Instagram — tap any reel to view on Instagram."
            />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {reels.map((reel: any) => (
                <ReelEmbed key={reel.reelId || reel._id} reel={reel} />
              ))}
            </div>
          </div>
        )}

        {/* Related services */}
        {allServices.length > 0 && (
          <div className="mt-16 md:mt-24">
            <SectionHeading eyebrow="Explore More" title="Other Services" />
            <div className="grid gap-6 md:grid-cols-3">
              {allServices.map((s: any) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
