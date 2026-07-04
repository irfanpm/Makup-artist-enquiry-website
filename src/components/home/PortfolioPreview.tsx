import Image from "next/image";
import { featuredPortfolio } from "@/data/portfolio";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function PortfolioPreview({ portfolioData }: { portfolioData?: any[] }) {
  const items = portfolioData || featuredPortfolio;
  return (
    <section id="portfolio" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Portfolio"
          title="Recent Transformations"
          subtitle="A glimpse of brides and beauties I've had the honour to work with."
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {items.slice(0, 6).map((item, i) => {
            const imgSrc = typeof item.image === "object" ? item.image.url : item.image;
            return (
              <Reveal
                key={item._id || item.title || i}
                delay={(i % 3) * 0.12}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <Image
                  src={imgSrc}
                  alt={item.title || "Portfolio look"}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-secondary/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="p-4">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs capitalize text-white/70">{item.category}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
