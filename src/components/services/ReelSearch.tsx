"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { searchReels, getReels } from "@/actions/reels";
import SectionHeading from "@/components/ui/SectionHeading";
import { getEmbedUrl } from "@/lib/instagram";

interface ReelSearchResult {
  _id: string;
  url: string;
  reelId: string;
  title?: string;
  serviceId?: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    price?: number;
    image?: { url: string };
  };
}

const SUGGESTED_LOOKS = ["Bridal", "Reception", "Engagement", "Party", "Airbrush"];

export default function ReelSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [reels, setReels] = useState<ReelSearchResult[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  // Load all reels on mount as default looks
  useEffect(() => {
    async function loadDefaultReels() {
      try {
        setLoading(true);
        const data = await getReels();
        setReels(data);
      } catch (err) {
        console.error("Failed to load initial reels:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDefaultReels();
  }, []);

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    setIsSearched(true);
    try {
      if (searchQuery.trim() === "") {
        const data = await getReels();
        setReels(data);
        setIsSearched(false);
      } else {
        const data = await searchReels(searchQuery);
        setReels(data);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleClear = () => {
    setQuery("");
    setIsSearched(false);
    handleSearch("");
  };

  return (
    <div className="space-y-12">
      {/* Search Input Widget */}
      <div className="mx-auto max-w-2xl rounded-3xl border border-primary/10 bg-white/60 p-6 shadow-xl shadow-primary/5 backdrop-blur-md md:p-8">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Paste Instagram reel URL or search by look name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-primary/20 bg-background px-6 py-4 pr-12 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-inner transition"
              id="reel-search-input"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full p-1 text-foreground/40 hover:text-foreground transition"
                aria-label="Clear search"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-primary p-2 text-white shadow-md hover:bg-primary-dark transition"
              aria-label="Search looks"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Suggestion tags */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-foreground/40">Try searching:</span>
          {SUGGESTED_LOOKS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleSuggestionClick(tag)}
              className="rounded-full bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary border border-primary/10 hover:bg-primary hover:text-white transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-medium text-foreground/50">Finding looks from Instagram...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Subheading depending on state */}
          <div className="flex items-center justify-between border-b border-primary/10 pb-4">
            <h3 className="font-serif text-xl font-semibold text-secondary">
              {isSearched ? `Search Results (${reels.length})` : "Explore Instagram Looks"}
            </h3>
            {isSearched && (
              <button
                onClick={handleClear}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>

          {reels.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-primary/20 bg-muted/5 py-16 text-center">
              <svg className="mx-auto h-12 w-12 text-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="mt-4 font-serif text-lg font-semibold text-secondary">No matching look found</h4>
              <p className="mt-2 text-sm text-foreground/60 max-w-sm mx-auto">
                We couldn't find any configured reel matching your query. Make sure to paste a valid Instagram reel link or use a different keyword.
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="mt-6 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-primary-dark transition"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {reels.map((reel) => (
                <div
                  key={reel._id}
                  className="group overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col md:flex-row h-full"
                >
                  {/* Reel Embed Left */}
                  <div className="w-full md:w-1/2 aspect-[9/16] max-h-[480px] bg-black relative shrink-0">
                    <iframe
                      src={getEmbedUrl(reel.reelId)}
                      className="absolute inset-0 h-full w-full border-0"
                      allowFullScreen
                      scrolling="no"
                      title={reel.title || "Instagram Reel preview"}
                    ></iframe>
                  </div>

                  {/* Service Info Right */}
                  <div className="p-6 flex flex-col justify-between flex-1 gap-6">
                    <div className="space-y-4">
                      {reel.title && (
                        <h4 className="font-serif text-lg font-semibold text-secondary leading-snug group-hover:text-primary transition duration-300">
                          {reel.title}
                        </h4>
                      )}

                      {reel.serviceId ? (
                        <div className="rounded-2xl bg-muted/40 p-4 border border-primary/5 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            Featured Package
                          </span>
                          <h5 className="font-serif text-base font-semibold text-secondary">
                            {reel.serviceId.name}
                          </h5>
                          {reel.serviceId.description && (
                            <p className="text-xs text-foreground/75 line-clamp-3">
                              {reel.serviceId.description}
                            </p>
                          )}
                          {reel.serviceId.price && (
                            <p className="text-sm font-semibold text-primary">
                              Starting from ₹{reel.serviceId.price.toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-foreground/40 italic">
                          Customized lookup service
                        </p>
                      )}
                    </div>

                    {reel.serviceId && (
                      <Link
                        href={`/services/${reel.serviceId.slug}`}
                        className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs font-semibold text-white shadow-sm hover:bg-primary-dark transition duration-300"
                      >
                        Customize & Enquire
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
