import { getReviews } from "@/actions/reviews";
import { getServices } from "@/actions/services";
import ReviewsManager from "@/components/admin/ReviewsManager";

export default async function AdminReviewsPage() {
  const [reviews, services] = await Promise.all([
    getReviews(false).catch(() => []), // fetch all reviews
    getServices().catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-secondary">Reviews</h1>
        <p className="text-sm text-foreground/60 mt-1">
          Moderate public reviews or manually add client feedback
        </p>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5">
        <ReviewsManager initialReviews={reviews} services={services} />
      </div>
    </div>
  );
}
