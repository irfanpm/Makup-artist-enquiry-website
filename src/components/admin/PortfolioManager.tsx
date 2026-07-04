"use client";

import { useState } from "react";
import { addPortfolioItem, deletePortfolioItem } from "@/actions/portfolio";
import ImageUploader from "./ImageUploader";

interface PortfolioManagerProps {
  initialItems: any[];
}

const categories = [
  { value: "bridal", label: "Bridal" },
  { value: "reception", label: "Reception" },
  { value: "engagement", label: "Engagement" },
  { value: "party", label: "Party" },
  { value: "photoshoot", label: "Photoshoot" },
];

export default function PortfolioManager({
  initialItems,
}: PortfolioManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [selectedTab, setSelectedTab] = useState("all");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("bridal");
  const [image, setImage] = useState<{ url: string; publicId: string } | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredItems = selectedTab === "all"
    ? items
    : items.filter((item) => item.category === selectedTab);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!image) {
      setError("Please upload an image first.");
      setLoading(false);
      return;
    }

    const payload = {
      title,
      category,
      image,
      isFeatured,
    };

    try {
      const created = await addPortfolioItem(payload);
      setItems([created, ...items]);
      setTitle("");
      setImage(null);
      setIsFeatured(false);
    } catch (err: any) {
      setError(err.message || "Failed to add portfolio item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;

    try {
      setItems(items.filter((item) => item._id !== id));
      await deletePortfolioItem(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete portfolio item");
      setItems(initialItems);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Portfolio Grid & Filter */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-primary/5 pb-4">
          <button
            onClick={() => setSelectedTab("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              selectedTab === "all"
                ? "bg-primary text-white"
                : "bg-muted text-secondary hover:bg-primary/10 hover:text-primary"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedTab(cat.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                selectedTab === cat.value
                  ? "bg-primary text-white"
                  : "bg-muted text-secondary hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <p className="text-sm text-foreground/50 py-4">No portfolio items in this category.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {filteredItems.map((item) => (
              <div key={item._id} className="group relative aspect-[3/4] overflow-hidden rounded-2xl border bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image.url}
                  alt={item.title || ""}
                  className="h-full w-full object-cover"
                />
                
                {/* Overlay details */}
                <div className="absolute inset-0 flex flex-col justify-between p-3 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-lg bg-red-600 p-1.5 text-white hover:bg-red-700 transition"
                      aria-label="Delete photo"
                    >
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-white space-y-0.5">
                    {item.title && <p className="text-xs font-bold">{item.title}</p>}
                    <p className="text-[10px] capitalize text-white/70">{item.category}</p>
                    {item.isFeatured && (
                      <span className="inline-block rounded-full bg-amber-400 px-2 py-0.5 text-[8px] font-bold text-secondary">
                        ★ Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Portfolio Item Form */}
      <div className="rounded-2xl border border-primary/5 bg-muted/10 p-6 space-y-6">
        <h2 className="font-serif text-lg font-bold text-secondary font-serif">Add Portfolio Photo</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Photo (Cloudinary Direct)</label>
            <div className="mt-1">
              <ImageUploader
                value={image || undefined}
                onUploadComplete={setImage}
                onRemove={() => setImage(null)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Title / Look Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Traditional Kerala Bride"
              className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-primary focus:ring-primary border-primary/30"
            />
            <span className="text-sm font-semibold text-secondary">Highlight on Homepage</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-white shadow-md hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? "Adding Photo..." : "Add to Portfolio"}
          </button>
        </form>
      </div>
    </div>
  );
}
