import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, rating, message, serviceId, customerImage, honeypot } = body;

    // Honeypot check to reject spam bots
    if (honeypot) {
      // Return 200 OK so the spammer thinks it succeeded
      return NextResponse.json({ success: true, message: "Review received" });
    }

    if (!customerName || !rating || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const review = await Review.create({
      customerName,
      rating: Number(rating),
      message,
      serviceId: serviceId || undefined,
      customerImage: customerImage || undefined,
      isApproved: false, // requires admin approval
      isFeatured: false,
      source: "public",
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error("Error creating public review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
