import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const reasons = [
  {
    icon: "🏆",
    title: "Award-Winning Artistry",
    text: "Best Bridal Makeup Artist — Kochi Wedding Awards 2024.",
  },
  {
    icon: "🧴",
    title: "Skin-Safe Products",
    text: "Dermatologically trusted premium brands, patch-tested for sensitive skin.",
  },
  {
    icon: "📸",
    title: "4K Camera-Ready",
    text: "HD & airbrush techniques designed to look flawless in photos and video.",
  },
  {
    icon: "🏠",
    title: "Doorstep Service",
    text: "I come to your home, venue, or hotel — anywhere in Kerala and beyond.",
  },
  {
    icon: "⏰",
    title: "Always On Time",
    text: "Early arrival before every muhurtham — your schedule is sacred.",
  },
  {
    icon: "💝",
    title: "Fully Customizable",
    text: "Build your own package with add-ons and pay only for what you need.",
  },
];

export default function WhyChooseMe() {
  return (
    <section className="relative overflow-hidden bg-secondary py-16 md:py-24">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Why Choose Me"
          title="The Difference Is in the Details"
          light
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delay={(i % 3) * 0.12}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-white/10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-2xl transition-transform duration-300 group-hover:scale-110">
                  {reason.icon}
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-white">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {reason.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
