"use client";

import { useEffect, useRef, useState } from "react";
import type { Reel } from "@/types";

/**
 * Lazy-loaded Instagram reel embed — the iframe is only created when the
 * reel scrolls into view, so heavy Instagram scripts never block page load.
 * Only the reel URL is stored; no video files touch the server.
 */
export default function ReelEmbed({ reel }: { reel: Reel }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-primary/10"
    >
      <div className="relative aspect-[9/16] w-full bg-muted">
        {visible ? (
          <iframe
            src={`https://www.instagram.com/reel/${reel.reelId}/embed`}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            scrolling="no"
            title={reel.title || "Instagram reel"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-current">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        )}
      </div>
      {reel.title && (
        <p className="px-4 py-3 text-sm font-medium text-secondary">{reel.title}</p>
      )}
    </div>
  );
}
