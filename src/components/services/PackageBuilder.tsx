"use client";

import { useMemo, useState, useEffect } from "react";
import type { AddOn, Service, AvailabilityEntry } from "@/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice, cn } from "@/lib/utils";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { logEnquiry } from "@/actions/enquiries";

interface PackageBuilderProps {
  service: Service;
  addons: AddOn[];
  whatsappNumber?: string;
  availability?: AvailabilityEntry[];
}

export default function PackageBuilder({
  service,
  addons,
  whatsappNumber,
  availability = [],
}: PackageBuilderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [persons, setPersons] = useState("");
  const [referenceReelUrl, setReferenceReelUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const dateParam = params.get("date");
      if (dateParam) {
        setEventDate(dateParam);
      }
    }
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const dateStatus = useMemo(() => {
    if (!eventDate) return null;
    const entry = availability.find((a) => a.date === eventDate);
    if (!entry) return { status: "available" as const };
    return {
      status: entry.status,
      maxBookings: entry.maxBookings ?? 1,
      bookedCount: entry.bookedCount ?? (entry.status === "booked" ? 1 : 0),
    };
  }, [eventDate, availability]);

  const selectedAddons = useMemo(
    () => addons.filter((a) => selected.includes(a.name)),
    [addons, selected]
  );

  const total = useMemo(
    () => service.price + selectedAddons.reduce((sum, a) => sum + a.price, 0),
    [service.price, selectedAddons]
  );

  const whatsappUrl = buildWhatsAppUrl({
    serviceName: service.name,
    addOns: selectedAddons.map((a) => ({ name: a.name, price: a.price })),
    totalPrice: total,
    eventDate,
    location,
    personCount: persons ? Number(persons) : undefined,
    referenceReelUrl: referenceReelUrl || undefined,
  }, whatsappNumber);

  const handleEnquiryClick = async () => {
    try {
      await logEnquiry({
        serviceName: service.name,
        totalPrice: total,
        eventDate: eventDate || undefined,
        location: location || undefined,
        personCount: persons ? Number(persons) : undefined,
        referenceReelUrl: referenceReelUrl || undefined,
        addOns: selectedAddons.map((a) => ({ name: a.name, price: a.price })),
      });
    } catch (err) {
      console.error("Failed to log enquiry:", err);
    }
  };

  function toggle(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10 md:p-8">
        <h3 className="font-serif text-2xl font-semibold text-secondary">
          Ready to Book?
        </h3>
        <p className="mt-1 mb-6 text-sm text-foreground/60">
          Check availability and customize your package with add-ons.
        </p>

        <div className="mb-6 flex items-center justify-between border-t border-primary/15 pt-4">
          <span className="font-semibold text-secondary">Starts at</span>
          <span className="font-serif text-2xl font-bold text-primary">
            {formatPrice(service.price)}
          </span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-white shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
        >
          Enquire Now
        </button>
      </div>

      {/* Sticky Mobile Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-primary/10 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-md"
        >
          Enquire Now
        </button>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground/60 transition hover:bg-muted-foreground/10 hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <h3 className="font-serif text-2xl font-semibold text-secondary">
              Customize Your Package
            </h3>
            <p className="mt-1 text-sm text-foreground/60">
              Select add-ons and send your customized package on WhatsApp.
            </p>

            {/* Add-ons */}
            <div className="mt-6 space-y-3">
              {addons.map((addon) => {
                const checked = selected.includes(addon.name);
                return (
                  <label
                    key={addon.name}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                      checked
                        ? "border-primary bg-primary/5"
                        : "border-primary/15 hover:border-primary/40"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(addon.name)}
                      className="mt-1 h-4 w-4 accent-[#b76e79]"
                    />
                    <span className="flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-secondary">
                          {addon.name}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          +{formatPrice(addon.price)}
                        </span>
                      </span>
                      {addon.description && (
                        <span className="mt-0.5 block text-xs text-foreground/60">
                          {addon.description}
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Event details */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="pb-date" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/60">
                  Event Date
                </label>
                <input
                  id="pb-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-lg border border-primary/20 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
                {dateStatus && (
                  <div className="mt-1.5 leading-none">
                    {dateStatus.status === "holiday" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        <span>⚠️</span> Artist is off-duty.
                      </span>
                    )}
                    {dateStatus.status === "booked" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                        <span>⚠️</span> Fully booked (waitlist).
                      </span>
                    )}
                    {dateStatus.status === "partially_booked" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                        <span>ℹ️</span> {dateStatus.maxBookings - dateStatus.bookedCount} slots left.
                      </span>
                    )}
                    {dateStatus.status === "available" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <span>✓</span> Date is available!
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="pb-location" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/60">
                  Location
                </label>
                <input
                  id="pb-location"
                  type="text"
                  placeholder="City / venue"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-primary/20 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="pb-persons" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/60">
                  No. of Persons
                </label>
                <input
                  id="pb-persons"
                  type="number"
                  min={1}
                  placeholder="1"
                  value={persons}
                  onChange={(e) => setPersons(e.target.value)}
                  className="w-full rounded-lg border border-primary/20 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Reference Instagram Reel URL */}
            <div className="mt-4">
              <label htmlFor="pb-reference" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Inspiration / Reference Reel URL (Optional)
              </label>
              <input
                id="pb-reference"
                type="url"
                placeholder="Paste Instagram video or look link..."
                value={referenceReelUrl}
                onChange={(e) => setReferenceReelUrl(e.target.value)}
                className="w-full rounded-lg border border-primary/20 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Price summary */}
            <div className="mt-6 rounded-xl bg-muted p-4">
              <div className="flex justify-between text-sm text-foreground/70">
                <span>{service.name} (base)</span>
                <span>{formatPrice(service.price)}</span>
              </div>
              {selectedAddons.map((a) => (
                <div key={a.name} className="mt-1 flex justify-between text-sm text-foreground/70">
                  <span>{a.name}</span>
                  <span>+{formatPrice(a.price)}</span>
                </div>
              ))}
              <div className="mt-3 flex justify-between border-t border-primary/15 pt-3">
                <span className="font-semibold text-secondary">Estimated Total</span>
                <span className="font-serif text-2xl font-bold text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleEnquiryClick}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-white shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Send Enquiry on WhatsApp
            </a>
            <p className="mt-3 text-center text-xs text-foreground/50">
              Final pricing is confirmed on WhatsApp after discussing your requirements.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
