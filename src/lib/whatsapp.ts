import { artist } from "@/data/artist";

export interface EnquiryPayload {
  serviceName: string;
  addOns: { name: string; price: number }[];
  totalPrice: number;
  eventDate?: string;
  location?: string;
  personCount?: number;
}

/** Builds a wa.me deep link with a pre-filled enquiry message. */
export function buildWhatsAppUrl(p: EnquiryPayload) {
  const addOnLines = p.addOns.length
    ? `Selected Add-ons:\n${p.addOns
        .map((a) => `• ${a.name} (+₹${a.price.toLocaleString("en-IN")})`)
        .join("\n")}\n\n`
    : "";

  const msg = `Hello! I'm interested in *${p.serviceName}*.

${addOnLines}Estimated Total: ₹${p.totalPrice.toLocaleString("en-IN")}
Event Date: ${p.eventDate || "-"}
Location: ${p.location || "-"}
No. of Persons: ${p.personCount || "-"}

Please share more details. Thank you!`;

  return `https://wa.me/${artist.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

/** Generic enquiry link for the floating button / hero CTA. */
export function quickEnquiryUrl(message?: string) {
  const msg =
    message ??
    `Hello! I found your website and would like to know more about your makeup services.`;
  return `https://wa.me/${artist.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}
