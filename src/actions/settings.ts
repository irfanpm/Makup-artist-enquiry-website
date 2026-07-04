"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { auth } from "@/lib/auth";

export async function getSettings() {
  await dbConnect();
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if they don't exist
      settings = await Settings.create({
        artistName: "Client Name",
        whatsappNumber: "910000000000",
        tagline: "Making your special day flawless",
        yearsExperience: 0,
        specializations: [],
        certifications: [],
        awards: [],
      });
    }
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw new Error("Failed to fetch settings");
  }
}

export async function updateSettings(data: any) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(data);
    } else {
      Object.assign(settings, data);
    }

    await settings.save();
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");

    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("Error updating settings:", error);
    throw new Error("Failed to update settings");
  }
}
