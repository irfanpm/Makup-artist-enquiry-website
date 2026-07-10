import { getPortfolioItems } from "@/actions/portfolio";
import { getServices } from "@/actions/services";
import PortfolioManager from "@/components/admin/PortfolioManager";

export default async function AdminPortfolioPage() {
  const [items, services] = await Promise.all([
    getPortfolioItems().catch(() => []),
    getServices().catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-secondary">Portfolio</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Add and organize images in your portfolio sections
        </p>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5">
        <PortfolioManager initialItems={items} services={services} />
      </div>
    </div>
  );
}
