import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { services, getServiceBySlug } from "@/data/services";
import { addonsForService } from "@/data/addons";
import { reelsForService } from "@/data/reels";
import { formatPrice, formatDuration } from "@/lib/utils";
import PackageBuilder from "@/components/services/PackageBuilder";
import ReelEmbed from "@/components/services/ReelEmbed";
import ServiceCard from "@/components/services/ServiceCard";
import SectionHeading from "@/components/ui/SectionHeading";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.name} — Prices & Packages`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const addons = addonsForService(slug);
  const reels = reelsForService(slug);
  const related = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Gallery + summary */}
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            {service.images.map((img, i) => (
              <div
                key={img}
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
                {service.priceLabel}{" "}
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

            <p className="mb-3 mt-7 text-sm font-semibold uppercase tracking-widest text-secondary">
              What&apos;s Included
            </p>
            <ul className="space-y-2.5">
              {service.features.map((feature) => (
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
          </div>
        </div>

        {/* Package builder */}
        <div className="mt-14 md:mt-20">
          <PackageBuilder service={service} addons={addons} />
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
              {reels.map((reel) => (
                <ReelEmbed key={reel.reelId} reel={reel} />
              ))}
            </div>
          </div>
        )}

        {/* Related services */}
        <div className="mt-16 md:mt-24">
          <SectionHeading eyebrow="Explore More" title="Other Services" />
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
