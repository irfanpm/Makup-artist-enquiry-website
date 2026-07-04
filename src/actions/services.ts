"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";
import { auth } from "@/lib/auth";

export async function getServices(onlyActive = false) {
  await dbConnect();
  try {
    const filter = onlyActive ? { isActive: true } : {};
    const services = await Service.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Failed to fetch services");
  }
}

export async function getServiceBySlug(slug: string) {
  await dbConnect();
  try {
    const service = await Service.findOne({ slug, isActive: true });
    return service ? JSON.parse(JSON.stringify(service)) : null;
  } catch (error) {
    console.error("Error fetching service by slug:", error);
    throw new Error("Failed to fetch service");
  }
}

export async function createService(data: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const service = await Service.create(data);
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/admin/services");
    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    console.error("Error creating service:", error);
    throw new Error("Failed to create service");
  }
}

export async function updateService(id: string, data: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const service = await Service.findByIdAndUpdate(id, data, { new: true });
    if (!service) throw new Error("Service not found");

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath(`/services/${service.slug}`);
    revalidatePath("/admin/services");
    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    console.error("Error updating service:", error);
    throw new Error("Failed to update service");
  }
}

export async function deleteService(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const service = await Service.findByIdAndDelete(id);
    if (!service) throw new Error("Service not found");

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath(`/services/${service.slug}`);
    revalidatePath("/admin/services");
    return { success: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    throw new Error("Failed to delete service");
  }
}

export async function toggleServiceActive(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const service = await Service.findById(id);
    if (!service) throw new Error("Service not found");

    service.isActive = !service.isActive;
    await service.save();

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath(`/services/${service.slug}`);
    revalidatePath("/admin/services");
    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    console.error("Error toggling service active state:", error);
    throw new Error("Failed to toggle service state");
  }
}

export async function toggleServiceFeatured(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const service = await Service.findById(id);
    if (!service) throw new Error("Service not found");

    service.isFeatured = !service.isFeatured;
    await service.save();

    revalidatePath("/");
    revalidatePath("/admin/services");
    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    console.error("Error toggling service featured state:", error);
    throw new Error("Failed to toggle service state");
  }
}

export async function reorderServices(orderedIds: string[]) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { sortOrder: index },
      },
    }));

    await Service.bulkWrite(bulkOps);

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/admin/services");
    return { success: true };
  } catch (error) {
    console.error("Error reordering services:", error);
    throw new Error("Failed to reorder services");
  }
}
