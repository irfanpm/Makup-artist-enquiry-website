// DUMMY DATA — replace with the client's real details before the demo if available.
// The WhatsApp number below should be YOUR number during the client demo so the
// live enquiry message arrives on your phone in front of her.

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const artist = {
  name: "Meera Krishnan",
  title: "Bridal & Celebrity Makeup Artist",
  tagline: "Making your special day flawless",
  bio: [
    "Hi, I'm Meera — a professional bridal makeup artist based in Kochi with over 8 years of experience transforming brides across Kerala. My signature style blends traditional South Indian elegance with modern HD techniques, so you look stunning both in person and on camera.",
    "From intimate engagement ceremonies to grand wedding receptions, I've had the honour of being part of 500+ special days. Every face is unique, and I take the time to understand your skin, your outfit, and your vision before designing your perfect look.",
  ],
  yearsExperience: 8,
  bridesCount: 500,
  rating: 4.9,
  reviewCount: 120,
  specializations: [
    "Bridal Makeup",
    "HD & Airbrush Makeup",
    "Traditional Kerala Looks",
    "Muslim & Christian Bridal",
    "Party & Photoshoot Makeup",
  ],
  certifications: [
    "Lakmé Academy Certified Professional",
    "MAC Pro Membership",
    "Advanced HD Makeup — LTA School of Beauty",
    "Airbrush Specialist Certification",
  ],
  awards: [
    "Best Bridal Makeup Artist — Kochi Wedding Awards 2024",
    "Top 10 Makeup Artists in Kerala — WedMeGood 2023",
  ],
  // E.164 format without "+" — used for wa.me links
  whatsappNumber: "919999999999",
  phone: "+91 99999 99999",
  email: "hello@meeramakeovers.com",
  instagramUrl: "https://instagram.com/meera.makeovers",
  facebookUrl: "https://facebook.com/meeramakeovers",
  youtubeUrl: "https://youtube.com/@meeramakeovers",
  studioAddress: "2nd Floor, Pearl Plaza, MG Road, Kochi, Kerala 682016",
  googleMapsEmbedUrl:
    "https://maps.google.com/maps?q=MG%20Road%20Kochi%20Kerala&t=&z=14&ie=UTF8&iwloc=&output=embed",
  heroImage: img("photo-1487412947147-5cebf100ffc2", 1600),
  profileImage: img("photo-1516975080664-ed2fc6a32937"),
};
