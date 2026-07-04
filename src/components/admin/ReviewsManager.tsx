"use client";

import { useState } from "react";
import {
  addReview,
  approveReview,
  toggleReviewFeatured,
  deleteReview,
} from "@/actions/reviews";

interface ReviewsManagerProps {
  initialReviews: any[];
  services: any[];
}

export default function ReviewsManager({
  initialReviews,
  services,
}: ReviewsManagerProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "new">("pending");
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pendingReviews = reviews.filter((r) => !r.isApproved);
  const approvedReviews = reviews.filter((r) => r.isApproved);

  const handleApprove = async (id: string) => {
    try {
      // Optimistic update
      setReviews(
        reviews.map((r) => (r._id === id ? { ...r, isApproved: true } : r))
      );
      await approveReview(id);
    } catch (err) {
      console.error(err);
      setReviews(initialReviews);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      setReviews(
        reviews.map((r) =>
          r._id === id ? { ...r, isFeatured: !r.isFeatured } : r
        )
      );
      await toggleReviewFeatured(id);
    } catch (err) {
      console.error(err);
      setReviews(initialReviews);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      setReviews(reviews.filter((r) => r._id !== id));
      await deleteReview(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete review");
      setReviews(initialReviews);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      customerName,
      rating: Number(rating),
      message,
      serviceId: serviceId || undefined,
    };

    try {
      const created = await addReview(payload);
      
      // Populate service name locally if it exists
      if (serviceId) {
        const sObj = services.find((s) => s._id === serviceId);
        created.serviceId = { _id: serviceId, name: sObj?.name || "" };
      }

      setReviews([created, ...reviews]);
      setCustomerName("");
      setRating(5);
      setMessage("");
      setServiceId("");
      setActiveTab("approved");
    } catch (err: any) {
      setError(err.message || "Failed to add manual review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-primary/5 pb-2">
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-2.5 text-sm font-semibold transition border-b-2 ${
            activeTab === "pending"
              ? "border-primary text-primary"
              : "border-transparent text-foreground/50 hover:text-primary"
          }`}
        >
          Pending ({pendingReviews.length})
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`pb-2.5 text-sm font-semibold transition border-b-2 ${
            activeTab === "approved"
              ? "border-primary text-primary"
              : "border-transparent text-foreground/50 hover:text-primary"
          }`}
        >
          Approved ({approvedReviews.length})
        </button>
        <button
          onClick={() => setActiveTab("new")}
          className={`pb-2.5 text-sm font-semibold transition border-b-2 ${
            activeTab === "new"
              ? "border-primary text-primary"
              : "border-transparent text-foreground/50 hover:text-primary"
          }`}
        >
          Add Manual Feedback
        </button>
      </div>

      {/* Tab: Pending */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {pendingReviews.length === 0 ? (
            <p className="text-sm text-foreground/50 py-4 text-center">No reviews pending moderation.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {pendingReviews.map((rev) => (
                <div key={rev._id} className="rounded-2xl border border-primary/10 p-5 bg-muted/5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-secondary">{rev.customerName}</h3>
                        <p className="text-[10px] text-foreground/40 mt-0.5">
                          Source: <span className="capitalize">{rev.source}</span>
                        </p>
                      </div>
                      <span className="text-amber-500 font-bold">
                        {"★".repeat(rev.rating)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/75 leading-relaxed italic">
                      "{rev.message}"
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleApprove(rev._id)}
                      className="flex-1 rounded-full bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(rev._id)}
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Approved */}
      {activeTab === "approved" && (
        <div className="space-y-4">
          {approvedReviews.length === 0 ? (
            <p className="text-sm text-foreground/50 py-4 text-center">No approved reviews yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {approvedReviews.map((rev) => (
                <div key={rev._id} className="rounded-2xl border border-primary/10 p-5 bg-white space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-secondary">{rev.customerName}</h3>
                        {rev.serviceId && (
                          <span className="inline-block rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-secondary/70 mt-1">
                            {rev.serviceId.name}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-amber-500 font-bold block">
                          {"★".repeat(rev.rating)}
                        </span>
                        {rev.isFeatured && (
                          <span className="inline-block rounded-full bg-amber-400 px-2 py-0.5 text-[8px] font-bold text-secondary mt-1">
                            ★ Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/75 leading-relaxed italic">
                      "{rev.message}"
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleToggleFeatured(rev._id)}
                      className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${
                        rev.isFeatured
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          : "bg-amber-400 text-secondary hover:bg-amber-500 shadow-sm"
                      }`}
                    >
                      {rev.isFeatured ? "Unfeature" : "Show on Homepage"}
                    </button>
                    <button
                      onClick={() => handleDelete(rev._id)}
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: New Manual */}
      {activeTab === "new" && (
        <form onSubmit={handleCreate} className="max-w-md space-y-4 bg-muted/10 p-6 rounded-2xl border border-primary/5">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Client Name</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Anjali Menon"
              className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Rating (Stars)</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="5">5 Stars (Excellent)</option>
              <option value="4">4 Stars (Good)</option>
              <option value="3">3 Stars (Average)</option>
              <option value="2">2 Stars (Poor)</option>
              <option value="1">1 Star (Very Poor)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Service Done</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select Service (Optional)...</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Review Message</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write customer feedback message here..."
              className="mt-1 block w-full rounded-2xl border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-white shadow-md hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Approved Review"}
          </button>
        </form>
      )}
    </div>
  );
}
