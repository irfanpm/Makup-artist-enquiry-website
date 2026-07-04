import Link from "next/link";
import { getEnquiryStats, getEnquiries } from "@/actions/enquiries";
import { getReviews } from "@/actions/reviews";
import { getServices } from "@/actions/services";
import { getAvailabilityEntries } from "@/actions/availability";

export default async function AdminDashboard() {
  // Fetch statistics and lists concurrently
  const [stats, recentEnquiries, allReviews, services, availability] = await Promise.all([
    getEnquiryStats().catch(() => ({ totalCount: 0, last30DaysCount: 0, last7DaysCount: 0, topServices: [] })),
    getEnquiries().then((res) => res.slice(0, 5)).catch(() => []),
    getReviews(false).catch(() => []), // fetch all reviews (approved + pending)
    getServices().catch(() => []),
    getAvailabilityEntries().catch(() => []),
  ]);

  const pendingReviews = allReviews.filter((r: any) => !r.isApproved);
  const activeServices = services.filter((s: any) => s.isActive).length;
  
  const bookedDates = availability.filter((a: any) => a.status === "booked");
  const upcomingBookings = bookedDates
    .filter((a: any) => new Date(a.date) >= new Date(new Date().setHours(0,0,0,0)))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome & Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-secondary">Dashboard</h1>
        <p className="text-sm text-foreground/60 mt-1">
          Welcome back! Here is a summary of your website performance.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Enquiry Clicks Card */}
        <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
              WhatsApp Enquiries
            </span>
            <div className="rounded-full bg-whatsapp/10 p-2 text-whatsapp">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-secondary">{stats.totalCount}</span>
            <p className="text-xs text-foreground/50 mt-1">
              <span className="font-medium text-emerald-600">+{stats.last30DaysCount}</span> in the last 30 days
            </p>
          </div>
        </div>

        {/* Pending Reviews Card */}
        <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
              Pending Reviews
            </span>
            <div className="rounded-full bg-amber-50 p-2 text-amber-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-secondary">{pendingReviews.length}</span>
            <p className="text-xs text-foreground/50 mt-1">
              Need moderation approval
            </p>
          </div>
        </div>

        {/* Services Card */}
        <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
              Active Services
            </span>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-secondary">{activeServices}</span>
            <p className="text-xs text-foreground/50 mt-1">
              Out of {services.length} total services
            </p>
          </div>
        </div>

        {/* Booked Days Card */}
        <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
              Booked Dates
            </span>
            <div className="rounded-full bg-indigo-50 p-2 text-indigo-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-secondary">{bookedDates.length}</span>
            <p className="text-xs text-foreground/50 mt-1">
              Marked as unavailable
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Enquiries and Pending Actions */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Enquiries */}
        <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-secondary">
              Recent Enquiries
            </h2>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="text-sm text-foreground/50 py-4 text-center">
              No WhatsApp clicks recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-primary/5 text-foreground/50 text-xs font-semibold uppercase">
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Event Date</th>
                    <th className="pb-3">Total Est.</th>
                    <th className="pb-3">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {recentEnquiries.map((enq: any) => (
                    <tr key={enq._id} className="text-foreground/80">
                      <td className="py-3.5 font-medium">{enq.serviceName || "Quick Enquiry"}</td>
                      <td className="py-3.5">{enq.eventDate || "-"}</td>
                      <td className="py-3.5 font-semibold">₹{enq.totalPrice?.toLocaleString("en-IN") || "-"}</td>
                      <td className="py-3.5 truncate max-w-[120px]">{enq.location || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar panels: Upcoming bookings & Pending Reviews */}
        <div className="space-y-8">
          {/* Upcoming Bookings */}
          <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-secondary">
                Upcoming Bookings
              </h2>
              <Link
                href="/admin/availability"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Calendar
              </Link>
            </div>
            {upcomingBookings.length === 0 ? (
              <p className="text-sm text-foreground/50 py-2">
                No upcoming booked dates.
              </p>
            ) : (
              <ul className="space-y-3">
                {upcomingBookings.map((booking: any) => (
                  <li
                    key={booking._id}
                    className="flex items-center justify-between rounded-xl bg-indigo-50/50 p-3 text-sm border border-indigo-50"
                  >
                    <span className="font-medium text-secondary">
                      {new Date(booking.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-xs text-foreground/60 max-w-[120px] truncate">
                      {booking.note || "Booked"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pending Reviews list */}
          <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-secondary">
                Moderate Reviews
              </h2>
              <Link
                href="/admin/reviews"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Manage
              </Link>
            </div>
            {pendingReviews.length === 0 ? (
              <p className="text-sm text-foreground/50 py-2">
                No reviews pending approval.
              </p>
            ) : (
              <ul className="space-y-3">
                {pendingReviews.slice(0, 3).map((rev: any) => (
                  <li key={rev._id} className="rounded-xl border border-primary/5 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-secondary">
                        {rev.customerName}
                      </span>
                      <span className="text-xs font-bold text-amber-500">
                        {"★".repeat(rev.rating)}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/70 line-clamp-2 italic">
                      "{rev.message}"
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
