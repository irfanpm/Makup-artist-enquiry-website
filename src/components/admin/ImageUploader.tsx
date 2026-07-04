"use client";

import { useState } from "react";

interface ImageUploaderProps {
  onUploadComplete: (image: { url: string; publicId: string }) => void;
  onRemove: () => void;
  value?: { url: string; publicId?: string };
}

export default function ImageUploader({
  onUploadComplete,
  onRemove,
  value,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      // 1. Fetch Cloudinary signature from our API
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        timestamp,
        folder: "makeup_portfolio",
      };

      const sigResponse = await fetch("/api/upload-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paramsToSign }),
      });

      if (!sigResponse.ok) {
        throw new Error("Failed to get upload signature");
      }

      const { signature, cloudName, apiKey } = await sigResponse.json();

      // 2. Upload directly to Cloudinary

      if (cloudName === "your_cloud_name" || apiKey === "your_api_key") {
        // Fallback: Convert to Base64 Data URL for testing without Cloudinary credentials
        const reader = new FileReader();
        reader.onloadend = () => {
          onUploadComplete({
            url: reader.result as string,
            publicId: `local-mock-${Date.now()}`,
          });
          setUploading(false);
        };
        reader.onerror = () => {
          setError("Failed to read local file");
          setUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "makeup_portfolio");

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errData = await uploadResponse.json();
        throw new Error(errData.error?.message || "Upload to Cloudinary failed");
      }

      const uploadData = await uploadResponse.json();

      onUploadComplete({
        url: uploadData.secure_url,
        publicId: uploadData.public_id,
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Something went wrong during upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {value?.url ? (
        <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-2xl border border-primary/10 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.url}
            alt="Uploaded Preview"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white shadow-md hover:bg-red-700 transition"
            aria-label="Remove image"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex max-w-xs justify-center rounded-2xl border border-dashed border-primary/20 px-6 py-8 hover:border-primary transition bg-muted/10">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-foreground/40"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-foreground/60">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary hover:text-primary-dark transition"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                  disabled={uploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-foreground/40">PNG, JPG, WEBP up to 5MB</p>
          </div>
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Uploading to Cloudinary...
        </div>
      )}

      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
