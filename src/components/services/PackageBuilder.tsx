"use client";

import { useMemo, useState } from "react";
import type { AddOn, Service } from "@/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice, cn } from "@/lib/utils";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

interface PackageBuilderProps {
  service: Service;
  addons: AddOn[];
}

export default function PackageBuilder({ service, addons }: PackageBuilderProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [persons, setPersons] = useState("");

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
  });

  function toggle(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10 md:p-8">
      <h3 className="font-serif text-2xl font-semibold text-secondary">
        Customize Your Package
      </h3>
      <p className="mt-1 text-sm text-foreground/60">
        Select add-ons and send your customized package on WhatsApp — no forms,
        no waiting.
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
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-4 text-base font-semibold text-white shadow-md shadow-whatsapp/25 transition-all hover:-translate-y-0.5 hover:brightness-95"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Send Enquiry on WhatsApp
      </a>
      <p className="mt-3 text-center text-xs text-foreground/50">
        Final pricing is confirmed on WhatsApp after discussing your requirements.
      </p>
    </div>
  );
}
