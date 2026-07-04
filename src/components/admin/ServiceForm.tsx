"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createService, updateService } from "@/actions/services";
import ImageUploader from "./ImageUploader";

interface ServiceFormProps {
  service?: any;
}

export default function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const [name, setName] = useState(service?.name || "");
  const [slug, setSlug] = useState(service?.slug || "");
  const [price, setPrice] = useState(service?.price || 0);
  const [priceLabel, setPriceLabel] = useState(service?.priceLabel || "Starting at");
  const [durationMinutes, setDurationMinutes] = useState(service?.durationMinutes || 120);
  const [shortDescription, setShortDescription] = useState(service?.shortDescription || "");
  const [description, setDescription] = useState(service?.description || "");
  const [features, setFeatures] = useState<string[]>(service?.features || [""]);
  const [images, setImages] = useState<any[]>(service?.images || []);
  const [isActive, setIsActive] = useState(service ? service.isActive : true);
  const [isFeatured, setIsFeatured] = useState(service ? service.isFeatured : false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!service) {
      // Auto slugify new services
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const handleFeatureChange = (index: number, val: string) => {
    const next = [...features];
    next[index] = val;
    setFeatures(next);
  };

  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddImage = (img: { url: string; publicId: string }) => {
    setImages([...images, img]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name,
      slug,
      price: Number(price),
      priceLabel,
      durationMinutes: Number(durationMinutes),
      shortDescription,
      description,
      features: features.filter(Boolean),
      images,
      isActive,
      isFeatured,
    };

    try {
      if (service) {
        await updateService(service._id, payload);
      } else {
        await createService(payload);
      }
      router.push("/admin/services");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save service");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl bg-white p-8 rounded-3xl border border-primary/10 shadow-md">
      <div className="border-b border-primary/5 pb-4">
        <h2 className="font-serif text-2xl font-bold text-secondary">
          {service ? "Edit Service" : "New Service"}
        </h2>
        <p className="text-xs text-foreground/50 mt-1">
          Provide the service details, pricing, and images below.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-semibold">
          {error}
        </div>
      )}

      {/* Grid sections */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Service Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Bridal HD Makeup"
            className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Slug</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. bridal-hd-makeup"
            className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Duration (minutes)</label>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Price Label</label>
          <input
            type="text"
            value={priceLabel}
            onChange={(e) => setPriceLabel(e.target.value)}
            className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Price (₹)</label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Short Description</label>
          <input
            type="text"
            required
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Brief tagline for lists..."
            className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Full Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of what is included, styling process..."
            className="mt-1 block w-full rounded-3xl border border-primary/20 bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Feature List Editor */}
        <div className="sm:col-span-2 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Features & Deliverables</label>
          {features.map((feat, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={feat}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder="e.g. Hair styling included"
                className="block w-full rounded-full border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-red-500 hover:text-red-700 p-2"
                aria-label="Remove feature"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition mt-1"
          >
            ✦ Add Feature
          </button>
        </div>

        {/* Images Upload */}
        <div className="sm:col-span-2 space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Images</label>
          <div className="grid gap-4 sm:grid-cols-2">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-video rounded-2xl overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white shadow-md hover:bg-red-700 transition"
                  aria-label="Remove image"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <ImageUploader
                onUploadComplete={handleAddImage}
                onRemove={() => {}}
              />
            )}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6 sm:col-span-2 pt-2 border-t border-primary/5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-primary focus:ring-primary border-primary/30"
            />
            <span className="text-sm font-semibold text-secondary">Active Service</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-primary focus:ring-primary border-primary/30"
            />
            <span className="text-sm font-semibold text-secondary">Featured on Homepage</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-primary/5">
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="rounded-full border border-primary/20 px-6 py-2.5 text-sm font-semibold text-secondary hover:bg-muted transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-dark transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Service"}
        </button>
      </div>
    </form>
  );
}
