"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;

// DUMMY: same photo — "before" shown desaturated. Replace with the client's
// real before/after photo pair for the launch version.
const beforeImage = img("photo-1544005313-94ddf0286df2");
const afterImage = img("photo-1544005313-94ddf0286df2");

/** Interactive drag slider revealing the makeover transformation. */
export default function BeforeAfter() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function updateFromClientX(clientX: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }

  return (
    <section className="bg-muted/60 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="The Transformation"
          title="Before & After Magic"
          subtitle="Drag the slider to see the difference professional artistry makes."
        />

        <Reveal>
          <div
            ref={containerRef}
            className="relative mx-auto aspect-[4/3] max-w-3xl cursor-ew-resize touch-none select-none overflow-hidden rounded-3xl shadow-2xl shadow-primary/20 md:aspect-[16/9]"
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              updateFromClientX(e.clientX);
            }}
            onPointerMove={(e) => dragging.current && updateFromClientX(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
          >
            {/* After (full colour) */}
            <Image
              src={afterImage}
              alt="After makeup"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
            {/* Before (desaturated) clipped to the left of the handle */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <Image
                src={beforeImage}
                alt="Before makeup"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover brightness-90 grayscale"
              />
            </div>

            {/* Divider + handle */}
            <div
              className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-lg"
              style={{ left: `${position}%` }}
            >
              <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-xl">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />
                </svg>
              </span>
            </div>

            <span className="absolute left-4 top-4 z-10 rounded-full bg-secondary/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              Before
            </span>
            <span className="absolute right-4 top-4 z-10 rounded-full bg-primary/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              After
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
