import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getSettings } from "@/actions/settings";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If there's no session, render children directly (e.g. for login page)
  if (!session) {
    return <>{children}</>;
  }

  const settings = await getSettings().catch(() => null);
  const artistName = settings?.artistName || "Artist";
  const logoUrl = settings?.logoImage?.url || null;

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar Navigation */}
      <AdminSidebar session={session} artistName={artistName} logoUrl={logoUrl} />

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-8 md:px-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
