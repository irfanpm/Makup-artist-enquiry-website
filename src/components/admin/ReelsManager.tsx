"use client";

import { useState } from "react";
import { addReel, deleteReel } from "@/actions/reels";

interface ReelsManagerProps {
  initialReels: any[];
  services: any[];
}

export default function ReelsManager({
  initialReels,
  services,
}: ReelsManagerProps) {
  const [reels, setReels] = useState(initialReels);
  const [url, setUrl] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!serviceId) {
      setError("Please select a service to link the reel to.");
      setLoading(false);
      return;
    }

    try {
      const created = await addReel(url, serviceId, title);
      
      // Since populated service name isn't returned directly by addReel, 
      // let's manually populate the serviceId object for local state display.
      const serviceObj = services.find((s) => s._id === serviceId);
      created.serviceId = {
        _id: serviceId,
        name: serviceObj?.name || "",
        slug: serviceObj?.slug || "",
      };

      setReels([created, ...reels]);
      setUrl("");
      setTitle("");
      setServiceId("");
    } catch (err: any) {
      setError(err.message || "Failed to add reel. Make sure the URL is a public Instagram Reel.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this reel?")) return;

    try {
      setReels(reels.filter((r) => r._id !== id));
      await deleteReel(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete reel");
      setReels(initialReels);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Reels List */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="font-serif text-xl font-bold text-secondary">Linked Reels</h2>
        {reels.length === 0 ? (
          <p className="text-sm text-foreground/50 py-4">No Instagram reels linked yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {reels.map((reel) => {
              const serviceName = reel.serviceId?.name || "Linked Service";
              return (
                <div key={reel._id} className="relative rounded-2xl border border-primary/10 bg-muted/5 p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {serviceName}
                      </span>
                      <h3 className="font-semibold text-sm text-secondary mt-1 max-w-[150px] truncate">
                        {reel.title || "Instagram Work"}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDelete(reel._id)}
                      className="rounded-lg p-1 text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                      aria-label="Delete reel"
                    >
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Lazy embedded iframe preview */}
                  <div className="aspect-[9/16] overflow-hidden rounded-xl bg-slate-100 border relative flex items-center justify-center">
                    <iframe
                      src={`https://www.instagram.com/reel/${reel.reelId}/embed`}
                      className="w-full h-full border-0"
                      allowFullScreen
                      scrolling="no"
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Reel Form */}
      <div className="rounded-2xl border border-primary/5 bg-muted/10 p-6 space-y-6">
        <h2 className="font-serif text-lg font-bold text-secondary">Link New Reel</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Instagram Reel URL</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://www.instagram.com/reel/C..."
              className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Title / Look Description</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kerala Bridal Look"
              className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Link to Service
            </label>
            <select
              required
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select Service...</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-white shadow-md hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? "Adding Reel..." : "Link Reel"}
          </button>
        </form>
      </div>
    </div>
  );
}
