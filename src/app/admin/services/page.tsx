import Link from "next/link";
import { getServices } from "@/actions/services";
import ServicesListManager from "@/components/admin/ServicesListManager";

export default async function AdminServicesPage() {
  const services = await getServices().catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-secondary">Services</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Manage your makeup services, prices, and features
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-dark transition"
        >
          Add Service
        </Link>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5">
        <ServicesListManager initialServices={services} />
      </div>
    </div>
  );
}
