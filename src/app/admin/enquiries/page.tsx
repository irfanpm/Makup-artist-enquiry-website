import { getEnquiries } from "@/actions/enquiries";
import EnquiryLogsTable from "@/components/admin/EnquiryLogsTable";

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries().catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-secondary font-serif">WhatsApp Enquiries</h1>
        <p className="text-sm text-foreground/60 mt-1">
          Review details of customers who clicked the WhatsApp enquiry button on your site
        </p>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5">
        <EnquiryLogsTable initialEnquiries={enquiries} />
      </div>
    </div>
  );
}
