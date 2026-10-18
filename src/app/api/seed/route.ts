import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import Settings from "@/models/Settings";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const forceReset = searchParams.get("reset") === "true";

    const email = "admin@makeup.com";
    const rawPassword = "admin123";
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const existingAdmin = await AdminUser.findOne({ email });

    if (existingAdmin && !forceReset) {
      return NextResponse.json(
        {
          message: "Admin account already exists. Pass ?reset=true to update password/credentials.",
          admin: {
            email: existingAdmin.email,
            name: existingAdmin.name,
          },
        },
        { status: 200 }
      );
    }

    let admin;
    if (existingAdmin) {
      existingAdmin.passwordHash = passwordHash;
      admin = await existingAdmin.save();
    } else {
      const anyAdmin = await AdminUser.findOne();
      if (anyAdmin) {
        anyAdmin.email = email;
        anyAdmin.passwordHash = passwordHash;
        admin = await anyAdmin.save();
      } else {
        admin = await AdminUser.create({
          name: "Admin Artist",
          email,
          passwordHash,
        });
      }
    }

    // Create default settings if none exist
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({
        artistName: "Admin Artist",
        whatsappNumber: "910000000000",
        tagline: "Making your special day flawless",
        bio: "Professional makeup artist specializing in bridal and fashion styling.",
        yearsExperience: 5,
        specializations: ["Bridal Makeup", "Reception Makeup", "Fashion Styling"],
        certifications: ["Certified by London Academy of Makeup", "MAC Pro Masterclass"],
        awards: ["Best Bridal Artist 2025"],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Admin credentials successfully configured!",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        temporaryPassword: rawPassword,
      },
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Seeding failed", details: error.message },
      { status: 500 }
    );
  }
}
