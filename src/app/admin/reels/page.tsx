import { getReels } from "@/actions/reels";
import { getServices } from "@/actions/services";
import ReelsManager from "@/components/admin/ReelsManager";

export default async function AdminReelsPage() {
  const [reels, services] = await Promise.all([
    getReels().catch(() => []),
    getServices().catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-secondary">Instagram Reels</h1>
        <p className="text-sm text-foreground/60 mt-1">
          Link public Instagram Reels to your services to display as previous work
        </p>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5">
        <ReelsManager initialReels={reels} services={services} />
      </div>
    </div>
  );
}
