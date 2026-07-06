import { quickEnquiryUrl } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

interface FloatingWhatsAppProps {
  settings?: any;
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  return (
    <a
      href={quickEnquiryUrl(undefined, settings?.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-whatsapp/40 transition-transform hover:scale-110"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
