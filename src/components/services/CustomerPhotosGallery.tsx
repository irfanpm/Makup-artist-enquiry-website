"use client";

import { useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";

interface CustomerPhotosGalleryProps {
  portfolioItems: any[];
  serviceName: string;
}

export default function CustomerPhotosGallery({ portfolioItems, serviceName }: CustomerPhotosGalleryProps) {
  const [showAll, setShowAll] = useState(false);

  if (!portfolioItems || portfolioItems.length === 0) {
    return null;
  }

  // Define how many items to show initially (one row of 4 on desktop)
  const INITIAL_COUNT = 4;
  const displayedItems = showAll ? portfolioItems : portfolioItems.slice(0, INITIAL_COUNT);
  const hasMore = portfolioItems.length > INITIAL_COUNT;

  return (
    <div className="mt-16 md:mt-24">
      <SectionHeading
        eyebrow="Portfolio"
        title="Customer Photos"
        subtitle={`See some of the stunning looks created for ${serviceName}.`}
      />
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {displayedItems.map((item: any) => (
          <div key={item._id} className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src={item.image.url}
              alt={item.title || `${serviceName} customer photo`}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>

      {!showAll && hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll(true)}
            className="rounded-full border border-primary/30 bg-transparent px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            See More Photos
          </button>
        </div>
      )}
    </div>
  );
}
