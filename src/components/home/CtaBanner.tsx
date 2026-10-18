import Image from "next/image";
import { artist } from "@/data/artist";
import { quickEnquiryUrl } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import Sparkle from "@/components/ui/Sparkle";
import Reveal from "@/components/ui/Reveal";

/** Full-width closing call-to-action before the FAQ/contact sections. */
export default function CtaBanner({ artistData }: { artistData?: any }) {
  const currentArtist = artistData || artist;
  
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {currentArtist.heroImage && (
        <Image
          src={currentArtist.heroImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/85 to-primary/70" />

      <Sparkle className="animate-float absolute left-[10%] top-[20%] h-6 w-6 text-gold/70" />
      <Sparkle className="animate-float absolute bottom-[22%] right-[14%] h-5 w-5 text-white/50 [animation-delay:1.5s]" />

      <Reveal className="relative z-10">
        <div className="mx-auto max-w-3xl px-4 text-center text-white md:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
            Dates Fill Fast in Wedding Season
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Your dream look is just{" "}
            <span className="italic text-primary">one message</span> away
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Tell me your date, your venue, and your vision — I&apos;ll take care
            of everything else.
          </p>
          <a
            href={quickEnquiryUrl(undefined, currentArtist.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-9 py-4 text-base font-semibold text-white shadow-xl shadow-primary/30 transition-all duration-200 hover:-translate-y-1 hover:bg-primary-dark"
          >
            <WhatsAppIcon className="h-6 w-6" />
            Reserve Your Date on WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}
