import Sparkle from "@/components/ui/Sparkle";

const items = [
  "Bridal Makeup",
  "HD Airbrush",
  "Reception Glam",
  "Engagement Looks",
  "Party Makeup",
  "Saree Draping",
  "Hair Styling",
  "Destination Weddings",
];

/** Infinite scrolling ribbon separating hero from content. */
export default function MarqueeRibbon() {
  const row = (
    <>
      {items.map((item) => (
        <span key={item} className="flex items-center gap-6 px-6">
          <span className="font-serif text-lg italic">{item}</span>
          <Sparkle className="h-3.5 w-3.5 text-gold" />
        </span>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden border-y border-primary/20 bg-primary py-3.5 text-white">
      <div className="animate-marquee flex w-max">
        <div className="flex">{row}</div>
        <div className="flex" aria-hidden="true">{row}</div>
      </div>
    </div>
  );
}
