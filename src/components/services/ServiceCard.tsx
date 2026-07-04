import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/types";
import { formatPrice, formatDuration } from "@/lib/utils";

export default function ServiceCard({ service }: { service: Service }) {
  const firstImage = service.images?.[0];
  const imgSrc = typeof firstImage === "object" && firstImage !== null ? (firstImage as any).url : (firstImage || "/images/placeholder.jpg");

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-primary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imgSrc}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-secondary shadow">
          {formatDuration(service.durationMinutes)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl font-semibold text-secondary">
          {service.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/70">
          {service.shortDescription}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-foreground/60">
            {service.priceLabel}{" "}
            <span className="text-lg font-bold text-primary">
              {formatPrice(service.price)}
            </span>
          </p>
          <span className="text-sm font-semibold text-primary transition-transform duration-200 group-hover:translate-x-1">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
