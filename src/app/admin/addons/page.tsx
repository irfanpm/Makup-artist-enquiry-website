import { getAddOns } from "@/actions/addons";
import { getServices } from "@/actions/services";
import AddOnsManager from "@/components/admin/AddOnsManager";

export default async function AdminAddOnsPage() {
  const [addons, services] = await Promise.all([
    getAddOns().catch(() => []),
    getServices().catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-secondary">Add-Ons</h1>
        <p className="text-sm text-foreground/60 mt-1">
          Manage extra services customers can add to their packages
        </p>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5">
        <AddOnsManager initialAddons={addons} services={services} />
      </div>
    </div>
  );
}
