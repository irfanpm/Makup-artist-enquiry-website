import { getAvailabilityEntries } from "@/actions/availability";
import AvailabilityManager from "@/components/admin/AvailabilityManager";

export default async function AdminAvailabilityPage() {
  const entries = await getAvailabilityEntries().catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-secondary">Availability Calendar</h1>
        <p className="text-sm text-foreground/60 mt-1">
          Mark dates as Booked or Holidays. Default is Available (Green).
        </p>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5">
        <AvailabilityManager initialEntries={entries} />
      </div>
    </div>
  );
}
