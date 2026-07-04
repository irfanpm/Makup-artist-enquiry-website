import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import Settings from "@/models/Settings";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();

    // Check if admin user already exists
    const adminCount = await AdminUser.countDocuments();
    if (adminCount > 0) {
      return NextResponse.json(
        { error: "Access Denied. Seeding is disabled for security reasons." },
        { status: 403 }
      );
    }

    // Create default admin user
    const passwordHash = await bcrypt.hash("admin123", 10);
    const admin = await AdminUser.create({
      name: "Admin Artist",
      email: "admin@makeup.com",
      passwordHash,
    });

    // Create default settings (singleton)
    await Settings.findOneAndUpdate(
      {},
      {
        artistName: "Admin Artist",
        whatsappNumber: "910000000000",
        tagline: "Making your special day flawless",
        bio: "Professional makeup artist specializing in bridal and fashion styling.",
        yearsExperience: 5,
        specializations: ["Bridal Makeup", "Reception Makeup", "Fashion Styling"],
        certifications: ["Certified by London Academy of Makeup", "MAC Pro Masterclass"],
        awards: ["Best Bridal Artist 2025"],
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Seeding complete!",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        temporaryPassword: "admin123",
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
