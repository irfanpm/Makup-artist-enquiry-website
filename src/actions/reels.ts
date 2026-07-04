"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import InstagramVideo from "@/models/InstagramVideo";
import { parseReelId } from "@/lib/instagram";
import { auth } from "@/lib/auth";

export async function getReels(serviceId?: string) {
  await dbConnect();
  try {
    const filter = serviceId ? { serviceId, isActive: true } : { isActive: true };
    const reels = await InstagramVideo.find(filter)
      .populate("serviceId", "name slug")
      .sort({ sortOrder: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(reels));
  } catch (error) {
    console.error("Error fetching reels:", error);
    throw new Error("Failed to fetch Instagram reels");
  }
}

export async function addReel(url: string, serviceId: string, title?: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const reelId = parseReelId(url);
  if (!reelId) {
    throw new Error("Invalid Instagram Reel URL");
  }

  await dbConnect();
  try {
    const reel = await InstagramVideo.create({
      url,
      reelId,
      serviceId,
      title,
    });

    revalidatePath("/services");
    revalidatePath("/admin/reels");
    return JSON.parse(JSON.stringify(reel));
  } catch (error) {
    console.error("Error creating Instagram reel:", error);
    throw new Error("Failed to add reel");
  }
}

export async function updateReel(id: string, data: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  if (data.url) {
    const reelId = parseReelId(data.url);
    if (!reelId) throw new Error("Invalid Instagram Reel URL");
    data.reelId = reelId;
  }

  await dbConnect();
  try {
    const reel = await InstagramVideo.findByIdAndUpdate(id, data, { new: true });
    if (!reel) throw new Error("Reel not found");

    revalidatePath("/services");
    revalidatePath("/admin/reels");
    return JSON.parse(JSON.stringify(reel));
  } catch (error) {
    console.error("Error updating Instagram reel:", error);
    throw new Error("Failed to update reel");
  }
}

export async function deleteReel(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const reel = await InstagramVideo.findByIdAndDelete(id);
    if (!reel) throw new Error("Reel not found");

    revalidatePath("/services");
    revalidatePath("/admin/reels");
    return { success: true };
  } catch (error) {
    console.error("Error deleting Instagram reel:", error);
    throw new Error("Failed to delete reel");
  }
}

export async function reorderReels(orderedIds: string[]) {
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

    await InstagramVideo.bulkWrite(bulkOps);

    revalidatePath("/services");
    revalidatePath("/admin/reels");
    return { success: true };
  } catch (error) {
    console.error("Error reordering reels:", error);
    throw new Error("Failed to reorder reels");
  }
}

export async function searchReels(query: string) {
  await dbConnect();
  try {
    if (!query || query.trim() === "") return [];

    const reelId = parseReelId(query);
    
    let filter: any;
    if (reelId) {
      filter = { reelId, isActive: true };
    } else {
      filter = {
        isActive: true,
        $or: [
          { title: { $regex: query, $options: "i" } },
          { url: { $regex: query, $options: "i" } },
          { reelId: { $regex: query, $options: "i" } }
        ]
      };
    }

    const reels = await InstagramVideo.find(filter)
      .populate("serviceId")
      .sort({ sortOrder: 1, createdAt: -1 });

    return JSON.parse(JSON.stringify(reels));
  } catch (error) {
    console.error("Error searching reels:", error);
    throw new Error("Failed to search reels");
  }
}
