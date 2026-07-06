"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSettings } from "@/actions/settings";
import ImageUploader from "./ImageUploader";

interface SettingsFormProps {
  settings: any;
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"profile" | "contact" | "seo">("profile");

  // Profile fields
  const [artistName, setArtistName] = useState(settings?.artistName || "");
  const [tagline, setTagline] = useState(settings?.tagline || "");
  const [bio, setBio] = useState(settings?.bio || "");
  const [yearsExperience, setYearsExperience] = useState(settings?.yearsExperience || 0);
  const [specializations, setSpecializations] = useState<string[]>(settings?.specializations || [""]);
  const [certifications, setCertifications] = useState<string[]>(settings?.certifications || [""]);
  const [awards, setAwards] = useState<string[]>(settings?.awards || [""]);
  const [heroImage, setHeroImage] = useState(settings?.heroImage || null);
  const [profileImage, setProfileImage] = useState(settings?.profileImage || null);
  const [logoImage, setLogoImage] = useState(settings?.logoImage || null);
  const [beforeImage, setBeforeImage] = useState(settings?.beforeImage || null);
  const [afterImage, setAfterImage] = useState(settings?.afterImage || null);

  // Contact fields
  const [whatsappNumber, setWhatsappNumber] = useState(settings?.whatsappNumber || "");
  const [phone, setPhone] = useState(settings?.phone || "");
  const [email, setEmail] = useState(settings?.email || "");
  const [instagramUrl, setInstagramUrl] = useState(settings?.instagramUrl || "");
  const [youtubeUrl, setYoutubeUrl] = useState(settings?.youtubeUrl || "");
  const [facebookUrl, setFacebookUrl] = useState(settings?.facebookUrl || "");
  const [studioAddress, setStudioAddress] = useState(settings?.studioAddress || "");
  const [googleMapsEmbedUrl, setGoogleMapsEmbedUrl] = useState(settings?.googleMapsEmbedUrl || "");

  // SEO fields
  const [seoTitle, setSeoTitle] = useState(settings?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(settings?.seoDescription || "");
  const [ogImage, setOgImage] = useState(settings?.ogImage || null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleArrayChange = (
    field: "specializations" | "certifications" | "awards",
    index: number,
    value: string
  ) => {
    let next;
    if (field === "specializations") {
      next = [...specializations];
      next[index] = value;
      setSpecializations(next);
    } else if (field === "certifications") {
      next = [...certifications];
      next[index] = value;
      setCertifications(next);
    } else {
      next = [...awards];
      next[index] = value;
      setAwards(next);
    }
  };

  const handleAddArrayItem = (field: "specializations" | "certifications" | "awards") => {
    if (field === "specializations") setSpecializations([...specializations, ""]);
    else if (field === "certifications") setCertifications([...certifications, ""]);
    else setAwards([...awards, ""]);
  };

  const handleRemoveArrayItem = (
    field: "specializations" | "certifications" | "awards",
    index: number
  ) => {
    if (field === "specializations") {
      setSpecializations(specializations.filter((_, i) => i !== index));
    } else if (field === "certifications") {
      setCertifications(certifications.filter((_, i) => i !== index));
    } else {
      setAwards(awards.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      artistName,
      tagline,
      bio,
      yearsExperience: Number(yearsExperience),
      specializations: specializations.filter(Boolean),
      certifications: certifications.filter(Boolean),
      awards: awards.filter(Boolean),
      heroImage: heroImage || undefined,
      profileImage: profileImage || undefined,
      logoImage: logoImage || undefined,
      beforeImage: beforeImage || undefined,
      afterImage: afterImage || undefined,
      whatsappNumber,
      phone,
      email,
      instagramUrl,
      youtubeUrl,
      facebookUrl,
      studioAddress,
      googleMapsEmbedUrl,
      seoTitle,
      seoDescription,
      ogImage: ogImage || undefined,
    };

    try {
      await updateSettings(payload);
      setSuccess("Settings saved successfully!");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sections Tab control */}
      <div className="flex gap-4 border-b border-primary/5 pb-2">
        <button
          onClick={() => setActiveSection("profile")}
          className={`pb-2.5 text-sm font-semibold transition border-b-2 ${
            activeSection === "profile"
              ? "border-primary text-primary"
              : "border-transparent text-foreground/50 hover:text-primary"
          }`}
        >
          Profile Details
        </button>
        <button
          onClick={() => setActiveSection("contact")}
          className={`pb-2.5 text-sm font-semibold transition border-b-2 ${
            activeSection === "contact"
              ? "border-primary text-primary"
              : "border-transparent text-foreground/50 hover:text-primary"
          }`}
        >
          Contact & Socials
        </button>
        <button
          onClick={() => setActiveSection("seo")}
          className={`pb-2.5 text-sm font-semibold transition border-b-2 ${
            activeSection === "seo"
              ? "border-primary text-primary"
              : "border-transparent text-foreground/50 hover:text-primary"
          }`}
        >
          SEO & Metadata
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        {success && (
          <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-100 font-semibold">
            {success}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Tab: Profile */}
        {activeSection === "profile" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Artist Name</label>
                <input
                  type="text"
                  required
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Artist Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Bio Description</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 block w-full rounded-2xl border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Years of Experience</label>
                <input
                  type="number"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Images: Logo, Profile & Hero */}
            <div className="grid gap-6 sm:grid-cols-3 pt-4 border-t border-primary/5">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Brand Logo Image</label>
                <ImageUploader
                  id="logo-image-upload"
                  aspect="aspect-square"
                  value={logoImage || undefined}
                  onUploadComplete={setLogoImage}
                  onRemove={() => setLogoImage(null)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Profile Headshot Image</label>
                <ImageUploader
                  id="profile-image-upload"
                  aspect="aspect-square"
                  value={profileImage || undefined}
                  onUploadComplete={setProfileImage}
                  onRemove={() => setProfileImage(null)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Hero Banner Image</label>
                <ImageUploader
                  id="hero-image-upload"
                  aspect="aspect-video"
                  value={heroImage || undefined}
                  onUploadComplete={setHeroImage}
                  onRemove={() => setHeroImage(null)}
                />
              </div>
            </div>

            {/* Images: Before & After makeover */}
            <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-primary/5">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Before Makeover Image</label>
                <ImageUploader
                  id="before-image-upload"
                  aspect="aspect-[3/4]"
                  value={beforeImage || undefined}
                  onUploadComplete={setBeforeImage}
                  onRemove={() => setBeforeImage(null)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">After Makeover Image</label>
                <ImageUploader
                  id="after-image-upload"
                  aspect="aspect-[3/4]"
                  value={afterImage || undefined}
                  onUploadComplete={setAfterImage}
                  onRemove={() => setAfterImage(null)}
                />
              </div>
            </div>

            {/* Certifications array */}
            <div className="space-y-2 pt-4 border-t border-primary/5">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Certifications</label>
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) => handleArrayChange("certifications", index, e.target.value)}
                    placeholder="e.g. Certified by London Academy"
                    className="block w-full rounded-full border border-primary/20 bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem("certifications", index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem("certifications")}
                className="text-xs font-semibold text-primary hover:text-primary-dark transition"
              >
                ✦ Add Certification
              </button>
            </div>
          </div>
        )}

        {/* Tab: Contact */}
        {activeSection === "contact" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">WhatsApp Number (E.164 - 91...)</label>
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Studio Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Social Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 pt-4 border-t border-primary/5">
                <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Social Profiles</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-secondary/60">Instagram Profile Link</label>
                    <input
                      type="url"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-secondary/60">YouTube Channel Link</label>
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 pt-4 border-t border-primary/5">
                <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Physical Address & Map</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-secondary/60">Studio Address</label>
                    <textarea
                      rows={2}
                      value={studioAddress}
                      onChange={(e) => setStudioAddress(e.target.value)}
                      placeholder="Physical studio coordinates..."
                      className="mt-1 block w-full rounded-2xl border border-primary/20 bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-secondary/60">Google Maps iframe src Link</label>
                    <input
                      type="url"
                      value={googleMapsEmbedUrl}
                      onChange={(e) => setGoogleMapsEmbedUrl(e.target.value)}
                      placeholder="https://www.google.com/maps/embed?..."
                      className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: SEO */}
        {activeSection === "seo" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Default Meta Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. Anjali Menon — Bridal Makeup Artist in Kochi"
                  className="mt-1 block w-full rounded-full border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Default Meta Description</label>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Meta description for search listings..."
                  className="mt-1 block w-full rounded-2xl border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Social Share OG Image</label>
                <div className="mt-1">
                  <ImageUploader
                    value={ogImage || undefined}
                    onUploadComplete={setOgImage}
                    onRemove={() => setOgImage(null)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-primary/5">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? "Saving Config..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
