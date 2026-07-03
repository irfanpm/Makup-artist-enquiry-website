import { artist } from "@/data/artist";
import CountUp from "@/components/ui/CountUp";

export default function StatsStrip() {
  const stats = [
    { end: artist.yearsExperience, suffix: "+", label: "Years Experience" },
    { end: artist.bridesCount, suffix: "+", label: "Brides Transformed" },
    { end: artist.certifications.length, suffix: "+", label: "Certifications" },
    { end: artist.rating, suffix: "★", decimals: 1, label: "Average Rating" },
  ];

  return (
    <section className="bg-secondary py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4 md:px-6">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-serif text-4xl font-bold text-primary md:text-5xl">
              <CountUp end={s.end} suffix={s.suffix} decimals={s.decimals ?? 0} />
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-white/70">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
