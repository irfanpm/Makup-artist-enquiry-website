"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { auth } from "@/lib/auth";

export async function getPortfolioItems(category?: string, onlyFeatured = false) {
  await dbConnect();
  try {
    const filter: any = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (onlyFeatured) {
      filter.isFeatured = true;
    }

    const items = await Portfolio.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    throw new Error("Failed to fetch portfolio items");
  }
}

export async function addPortfolioItem(data: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const item = await Portfolio.create(data);
    revalidatePath("/portfolio");
    revalidatePath("/");
    revalidatePath("/admin/portfolio");
    return JSON.parse(JSON.stringify(item));
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    throw new Error("Failed to create portfolio item");
  }
}

export async function updatePortfolioItem(id: string, data: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const item = await Portfolio.findByIdAndUpdate(id, data, { new: true });
    if (!item) throw new Error("Portfolio item not found");

    revalidatePath("/portfolio");
    revalidatePath("/");
    revalidatePath("/admin/portfolio");
    return JSON.parse(JSON.stringify(item));
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    throw new Error("Failed to update portfolio item");
  }
}

export async function deletePortfolioItem(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const item = await Portfolio.findById(id);
    if (!item) throw new Error("Portfolio item not found");

    // Delete image from Cloudinary if publicId exists
    if (item.image?.publicId) {
      await deleteFromCloudinary(item.image.publicId);
    }

    await Portfolio.findByIdAndDelete(id);

    revalidatePath("/portfolio");
    revalidatePath("/");
    revalidatePath("/admin/portfolio");
    return { success: true };
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    throw new Error("Failed to delete portfolio item");
  }
}
