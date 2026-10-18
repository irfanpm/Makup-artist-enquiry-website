import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { artist } from "@/data/artist";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { getSettings } from "@/actions/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings().catch(() => null);

  const title = settings?.seoTitle || settings?.artistName || artist.brandName || artist.name;
  const description = settings?.seoDescription || `${settings?.tagline || artist.tagline}. Bridal, HD & airbrush makeup by ${settings?.artistName || artist.name}, ${settings?.yearsExperience || artist.yearsExperience}+ years experience, ${artist.bridesCount}+ brides. Enquire on WhatsApp.`;

  return {
    title,
    description,
    openGraph: {
      images: settings?.ogImage?.url ? [settings.ogImage.url] : [],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
