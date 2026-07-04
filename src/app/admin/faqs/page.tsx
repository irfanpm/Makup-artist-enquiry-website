import { getFaqs } from "@/actions/faqs";
import FaqsManager from "@/components/admin/FaqsManager";

export default async function AdminFaqsPage() {
  const faqs = await getFaqs().catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-secondary">FAQs</h1>
        <p className="text-sm text-foreground/60 mt-1">
          Manage frequently asked questions displayed on the homepage
        </p>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5">
        <FaqsManager initialFaqs={faqs} />
      </div>
    </div>
  );
}
