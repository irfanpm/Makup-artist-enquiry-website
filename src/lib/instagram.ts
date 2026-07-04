/**
 * Helper utilities for parsing Instagram reel URLs and constructing embed URLs.
 */

export function parseReelId(url: string): string | null {
  if (!url) return null;
  // Matches instagram.com/reel/abc123XYZ/ or instagram.com/p/abc123XYZ/
  const match = url.match(/(?:reel|p)\/([a-zA-Z0-9_\-]+)/i);
  return match ? match[1] : null;
}

export function getEmbedUrl(reelId: string): string {
  return `https://www.instagram.com/reel/${reelId}/embed`;
}
