"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Availability from "@/models/Availability";
import { auth } from "@/lib/auth";

export async function getAvailabilityEntries() {
  await dbConnect();
  try {
    const entries = await Availability.find().sort({ date: 1 });
    return JSON.parse(JSON.stringify(entries));
  } catch (error) {
    console.error("Error fetching availability entries:", error);
    throw new Error("Failed to fetch availability");
  }
}

export async function setDateStatus(date: string, status: "available" | "booked" | "holiday", note?: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    if (status === "available") {
      // Available is the default, so we can just delete the entry to keep the DB clean
      await Availability.findOneAndDelete({ date });
    } else {
      await Availability.findOneAndUpdate(
        { date },
        { status, note },
        { upsert: true, new: true }
      );
    }

    revalidatePath("/availability");
    revalidatePath("/admin/availability");
    return { success: true };
  } catch (error) {
    console.error("Error setting date status:", error);
    throw new Error("Failed to set availability");
  }
}

export async function clearDate(date: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    await Availability.findOneAndDelete({ date });
    revalidatePath("/availability");
    revalidatePath("/admin/availability");
    return { success: true };
  } catch (error) {
    console.error("Error clearing date:", error);
    throw new Error("Failed to clear availability");
  }
}

export async function bulkSetRange(
  startDateStr: string,
  endDateStr: string,
  status: "available" | "booked" | "holiday",
  note?: string
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      throw new Error("Invalid date range");
    }

    const bulkOps: any[] = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split("T")[0];
      
      if (status === "available") {
        bulkOps.push({
          deleteOne: {
            filter: { date: dateString }
          }
        });
      } else {
        bulkOps.push({
          updateOne: {
            filter: { date: dateString },
            update: { $set: { status, note } },
            upsert: true
          }
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (bulkOps.length > 0) {
      await Availability.bulkWrite(bulkOps);
    }

    revalidatePath("/availability");
    revalidatePath("/admin/availability");
    return { success: true, count: bulkOps.length };
  } catch (error) {
    console.error("Error setting bulk range status:", error);
    throw new Error("Failed to perform bulk update");
  }
}
