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

export const metadata: Metadata = {
  title: `Sahala `,
  description: `${artist.tagline}. Bridal, HD & airbrush makeup by ${artist.name}, ${artist.yearsExperience}+ years experience, ${artist.bridesCount}+ brides. Enquire on WhatsApp.`,
};

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
