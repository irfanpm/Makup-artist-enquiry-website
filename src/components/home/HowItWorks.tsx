import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    icon: "💄",
    title: "Pick Your Look",
    text: "Browse services and watch real transformations from previous brides.",
  },
  {
    icon: "✨",
    title: "Customize Package",
    text: "Add hair styling, draping, family makeup — watch your price update live.",
  },
  {
    icon: "💬",
    title: "Enquire on WhatsApp",
    text: "One tap sends your customized package straight to my WhatsApp.",
  },
  {
    icon: "👰",
    title: "Shine on Your Day",
    text: "Trial, confirmation, and a flawless look that lasts all celebration long.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="How It Works"
          title="Booking Made Beautifully Simple"
          subtitle="No forms, no waiting — from browsing to booking in four easy steps."
        />

        <div className="relative grid gap-8 md:grid-cols-4">
          {/* Connecting dashed line (desktop) */}
          <div className="absolute left-[12%] right-[12%] top-9 hidden border-t-2 border-dashed border-primary/30 md:block" />

          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.15} className="relative text-center">
              <div className="relative z-10 mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white text-3xl shadow-lg shadow-primary/15 ring-2 ring-primary/20">
                {step.icon}
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-lg font-semibold text-secondary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                {step.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
