"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import { auth } from "@/lib/auth";

export async function getReviews(onlyApproved = true, onlyFeatured = false) {
  await dbConnect();
  try {
    const filter: any = {};
    if (onlyApproved) {
      filter.isApproved = true;
    }
    if (onlyFeatured) {
      filter.isFeatured = true;
    }

    const reviews = await Review.find(filter)
      .populate("serviceId", "name")
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }
}

export async function addReview(data: any) {
  // Can be added by admin (auto-approved) or via public form (needs approval)
  const session = await auth();
  
  await dbConnect();
  try {
    const reviewData = { ...data };
    if (session) {
      reviewData.isApproved = true;
      reviewData.source = "admin";
    } else {
      reviewData.isApproved = false;
      reviewData.source = "public";
    }

    const review = await Review.create(reviewData);
    
    if (review.isApproved) {
      revalidatePath("/reviews");
      revalidatePath("/");
    }
    revalidatePath("/admin/reviews");
    
    return JSON.parse(JSON.stringify(review));
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Failed to create review");
  }
}

export async function approveReview(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );
    if (!review) throw new Error("Review not found");

    revalidatePath("/reviews");
    revalidatePath("/");
    revalidatePath("/admin/reviews");
    return JSON.parse(JSON.stringify(review));
  } catch (error) {
    console.error("Error approving review:", error);
    throw new Error("Failed to approve review");
  }
}

export async function toggleReviewFeatured(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const review = await Review.findById(id);
    if (!review) throw new Error("Review not found");

    review.isFeatured = !review.isFeatured;
    // Auto-approve if we are featuring it
    if (review.isFeatured) {
      review.isApproved = true;
    }
    await review.save();

    revalidatePath("/reviews");
    revalidatePath("/");
    revalidatePath("/admin/reviews");
    return JSON.parse(JSON.stringify(review));
  } catch (error) {
    console.error("Error toggling review featured state:", error);
    throw new Error("Failed to toggle review state");
  }
}

export async function deleteReview(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) throw new Error("Review not found");

    revalidatePath("/reviews");
    revalidatePath("/");
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Failed to delete review");
  }
}
