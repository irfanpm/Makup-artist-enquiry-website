import { getSettings } from "@/actions/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings().catch(() => null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-secondary font-serif">Settings</h1>
        <p className="text-sm text-foreground/60 mt-1">
          Configure your artist profile, contact details, and SEO metadata
        </p>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
