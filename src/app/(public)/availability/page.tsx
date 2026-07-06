import type { Metadata } from "next";
import { getAvailabilityEntries } from "@/actions/availability";
import { getServices } from "@/actions/services";
import { getSettings } from "@/actions/settings";
import PublicAvailabilityCalendar from "@/components/services/PublicAvailabilityCalendar";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Availability Calendar — Book Your Date",
  description:
    "Check availability, view open slots, and enquire for bridal and event makeup bookings in real time.",
};

// Disable static generation cache for this page so it always shows the latest database availability
export const revalidate = 0;

export default async function PublicAvailabilityPage() {
  const [entries, services, settings] = await Promise.all([
    getAvailabilityEntries().catch(() => []),
    getServices().then((res) => res.filter((s: any) => s.isActive)).catch(() => []),
    getSettings().catch(() => null),
  ]);

  return (
    <div className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Availability"
          title="Plan Your Special Day"
          subtitle="Check real-time slot availability, off-duty days, and book services instantly."
        />

        <div className="mt-10">
          <PublicAvailabilityCalendar
            initialEntries={entries}
            services={services}
            whatsappNumber={settings?.whatsappNumber}
          />
        </div>
      </div>
    </div>
  );
}
