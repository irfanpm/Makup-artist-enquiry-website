import Image from "next/image";
import { artist } from "@/data/artist";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function AboutSection({ artistData }: { artistData?: any }) {
  const currentArtist = artistData || artist;
  return (
    <section id="about" className="py-16 md:py-24"> 
    {/* section */}
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
        <Reveal from="left" className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl shadow-xl shadow-primary/15">
          <Image
            src={currentArtist.profileImage}
            alt={currentArtist.name}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
            <p className="font-serif text-2xl font-bold text-primary">
              {currentArtist.yearsExperience}+
            </p>
            <p className="text-xs uppercase tracking-wider text-foreground/60">
              Years of Artistry
            </p>
          </div>
        </Reveal>

        <Reveal from="right">
          <SectionHeading
            eyebrow="About Me"
            title={`Meet ${currentArtist.name.split(" ")[0]}`}
            align="left"
          />
          {currentArtist.bio.map((para: string, i: number) => (
            <p key={i} className="mb-4 leading-relaxed text-foreground/75">
              {para}
            </p>
          ))}

          <p className="mb-3 mt-6 text-sm font-semibold uppercase tracking-widest text-secondary">
            Certifications
          </p>
          <ul className="flex flex-wrap gap-2">
            {currentArtist.certifications.map((cert: string) => (
              <li
                key={cert}
                className="rounded-full bg-muted px-4 py-1.5 text-xs font-medium text-secondary"
              >
                ✦ {cert}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
