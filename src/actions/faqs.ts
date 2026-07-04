"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Faq from "@/models/Faq";
import { auth } from "@/lib/auth";

export async function getFaqs(onlyActive = false) {
  await dbConnect();
  try {
    const filter = onlyActive ? { isActive: true } : {};
    const faqs = await Faq.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(faqs));
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw new Error("Failed to fetch FAQs");
  }
}

export async function createFaq(data: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const faq = await Faq.create(data);
    revalidatePath("/");
    revalidatePath("/admin/faqs");
    return JSON.parse(JSON.stringify(faq));
  } catch (error) {
    console.error("Error creating FAQ:", error);
    throw new Error("Failed to create FAQ");
  }
}

export async function updateFaq(id: string, data: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const faq = await Faq.findByIdAndUpdate(id, data, { new: true });
    if (!faq) throw new Error("FAQ not found");

    revalidatePath("/");
    revalidatePath("/admin/faqs");
    return JSON.parse(JSON.stringify(faq));
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw new Error("Failed to update FAQ");
  }
}

export async function deleteFaq(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) throw new Error("FAQ not found");

    revalidatePath("/");
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw new Error("Failed to delete FAQ");
  }
}

export async function reorderFaqs(orderedIds: string[]) {
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

    await Faq.bulkWrite(bulkOps);

    revalidatePath("/");
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch (error) {
    console.error("Error reordering FAQs:", error);
    throw new Error("Failed to reorder FAQs");
  }
}
