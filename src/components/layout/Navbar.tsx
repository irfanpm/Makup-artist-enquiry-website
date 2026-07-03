"use client";

import { useState } from "react";
import Link from "next/link";
import { artist } from "@/data/artist";
import { quickEnquiryUrl } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex flex-col leading-tight" onClick={() => setOpen(false)}>
          <span className="font-serif text-xl font-semibold text-secondary">
            {artist.name}
          </span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-primary">
            Makeup Artist
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={quickEnquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-whatsapp px-5 py-2 text-sm font-semibold text-white transition hover:brightness-95 md:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Enquire Now
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-secondary md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-primary/10 transition-all duration-300 md:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <ul className="flex flex-col gap-1 px-4 py-3">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-primary"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <a
              href={quickEnquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Enquire on WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
