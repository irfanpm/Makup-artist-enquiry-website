"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import AddOn from "@/models/AddOn";
import { auth } from "@/lib/auth";

export async function getAddOns(onlyActive = false) {
  await dbConnect();
  try {
    const filter = onlyActive ? { isActive: true } : {};
    const addons = await AddOn.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(addons));
  } catch (error) {
    console.error("Error fetching add-ons:", error);
    throw new Error("Failed to fetch add-ons");
  }
}

export async function getAddOnsForService(serviceId: string) {
  await dbConnect();
  try {
    // Return add-ons that have empty serviceIds OR contain this serviceId
    const addons = await AddOn.find({
      isActive: true,
      $or: [
        { serviceIds: { $exists: true, $size: 0 } },
        { serviceIds: serviceId },
      ],
    }).sort({ sortOrder: 1 });
    return JSON.parse(JSON.stringify(addons));
  } catch (error) {
    console.error("Error fetching add-ons for service:", error);
    throw new Error("Failed to fetch service add-ons");
  }
}

export async function createAddOn(data: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const addon = await AddOn.create(data);
    revalidatePath("/services");
    revalidatePath("/admin/addons");
    return JSON.parse(JSON.stringify(addon));
  } catch (error) {
    console.error("Error creating add-on:", error);
    throw new Error("Failed to create add-on");
  }
}

export async function updateAddOn(id: string, data: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const addon = await AddOn.findByIdAndUpdate(id, data, { new: true });
    if (!addon) throw new Error("Add-on not found");

    revalidatePath("/services");
    revalidatePath("/admin/addons");
    return JSON.parse(JSON.stringify(addon));
  } catch (error) {
    console.error("Error updating add-on:", error);
    throw new Error("Failed to update add-on");
  }
}

export async function deleteAddOn(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const addon = await AddOn.findByIdAndDelete(id);
    if (!addon) throw new Error("Add-on not found");

    revalidatePath("/services");
    revalidatePath("/admin/addons");
    return { success: true };
  } catch (error) {
    console.error("Error deleting add-on:", error);
    throw new Error("Failed to delete add-on");
  }
}
