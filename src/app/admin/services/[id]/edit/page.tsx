import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";
import ServiceForm from "@/components/admin/ServiceForm";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  await dbConnect();
  
  let service;
  try {
    service = await Service.findById(id);
  } catch (error) {
    console.error("Invalid ID format or DB error:", error);
    return notFound();
  }

  if (!service) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <ServiceForm service={JSON.parse(JSON.stringify(service))} />
    </div>
  );
}
