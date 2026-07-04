"use server";

import dbConnect from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { auth } from "@/lib/auth";

export async function logEnquiry(payload: any) {
  // This is a public action to log clicks to WhatsApp, no session check is needed
  await dbConnect();
  try {
    const enquiry = await Enquiry.create(payload);
    return JSON.parse(JSON.stringify(enquiry));
  } catch (error) {
    console.error("Error logging enquiry click:", error);
    // Don't crash user redirection flow if logging fails
    return null;
  }
}

export async function getEnquiries(startDateStr?: string, endDateStr?: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const filter: any = {};
    
    if (startDateStr || endDateStr) {
      filter.createdAt = {};
      if (startDateStr) {
        filter.createdAt.$gte = new Date(startDateStr);
      }
      if (endDateStr) {
        // Set to end of the day
        const end = new Date(endDateStr);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const enquiries = await Enquiry.find(filter)
      .populate("serviceId", "name")
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(enquiries));
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    throw new Error("Failed to fetch enquiries");
  }
}

export async function getEnquiryStats() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const totalCount = await Enquiry.countDocuments();
    const last30DaysCount = await Enquiry.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });
    const last7DaysCount = await Enquiry.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Top services by enquiry count
    const topServices = await Enquiry.aggregate([
      {
        $group: {
          _id: "$serviceName",
          count: { $sum: 1 },
          totalRevenue: { $sum: { $ifNull: ["$totalPrice", 0] } },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return {
      totalCount,
      last30DaysCount,
      last7DaysCount,
      topServices,
    };
  } catch (error) {
    console.error("Error calculating enquiry stats:", error);
    throw new Error("Failed to fetch statistics");
  }
}
