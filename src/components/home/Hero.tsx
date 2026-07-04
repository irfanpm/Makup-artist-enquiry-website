"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { artist } from "@/data/artist";
import { quickEnquiryUrl } from "@/lib/whatsapp";
import Button from "@/components/ui/Button";
import Rating from "@/components/ui/Rating";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import Sparkle from "@/components/ui/Sparkle";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export default function Hero({ artistData }: { artistData?: any }) {
  const currentArtist = artistData || artist;
  const nameWords = currentArtist.name.split(" ");

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      {/* Cinematic slow-zoom background */}
      <div className="absolute inset-0">
        <Image
          src={currentArtist.heroImage}
          alt={`${currentArtist.name} — ${currentArtist.title}`}
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/60 to-secondary/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent" />

      {/* Floating decorative sparkles */}
      <Sparkle className="animate-float absolute left-[8%] top-[18%] h-6 w-6 text-gold/70" />
      <Sparkle className="animate-float absolute right-[12%] top-[26%] h-4 w-4 text-primary/80 [animation-delay:1.2s]" />
      <Sparkle className="animate-float absolute bottom-[24%] left-[42%] h-5 w-5 text-white/40 [animation-delay:2.1s]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24 md:px-6">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.15 }}
          className="max-w-2xl text-white"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-sm"
          >
            <Sparkle className="h-3 w-3 text-gold" />
            {currentArtist.title}
          </motion.p>

          <h1 className="font-serif text-5xl font-semibold leading-[1.05] md:text-7xl">
            {nameWords.map((word: string, i: number) => (
              <motion.span
                key={word}
                variants={fadeUp}
                className={i === nameWords.length - 1 ? "block italic text-primary" : "block"}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-md text-lg leading-relaxed text-white/85 md:text-xl">
            “{currentArtist.tagline}” — premium bridal artistry with{" "}
            <span className="text-gold">{currentArtist.yearsExperience}+ years</span> of
            experience across Kerala.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
            <span className="relative">
              <span className="animate-glow absolute inset-0 rounded-full bg-whatsapp/60 blur-md" />
              <Button href={quickEnquiryUrl(undefined, currentArtist.whatsappNumber)} variant="whatsapp" external className="relative">
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp Enquiry
              </Button>
            </span>
            <Button href="/services" variant="light">
              Explore Services →
            </Button>
          </motion.div>

          {/* Glass rating card */}
          <motion.div
            variants={fadeUp}
            className="mt-10 inline-flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-md"
          >
            <div className="flex -space-x-2">
              {["A", "F", "S"].map((ch) => (
                <span
                  key={ch}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-secondary bg-muted font-serif text-sm font-semibold text-secondary"
                >
                  {ch}
                </span>
              ))}
            </div>
            <div>
              <span className="flex items-center gap-2">
                <Rating value={currentArtist.rating} />
                <span className="text-sm font-bold">{currentArtist.rating}</span>
              </span>
              <p className="text-xs text-white/75">
                Loved by {currentArtist.reviewCount}+ brides
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/70">
        <svg viewBox="0 0 24 24" className="animate-scroll-hint h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
