import { artist } from "@/data/artist";
import { quickEnquiryUrl } from "@/lib/whatsapp";
import SectionHeading from "@/components/ui/SectionHeading";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function ContactSection({ artistData }: { artistData?: any }) {
  const currentArtist = artistData || artist;
  const telLink = currentArtist.phone ? currentArtist.phone.replace(/\s/g, "") : "";

  return (
    <section id="contact" className="bg-muted/60 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Visit the Studio"
          subtitle="Walk-ins by appointment — message on WhatsApp to book your consultation."
        />

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Studio Address
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                {currentArtist.studioAddress}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {currentArtist.phone && (
                <a
                  href={`tel:${telLink}`}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10 transition hover:ring-primary/40"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Call
                  </p>
                  <p className="mt-2 text-sm font-medium text-secondary">{currentArtist.phone}</p>
                </a>
              )}
              {currentArtist.email && (
                <a
                  href={`mailto:${currentArtist.email}`}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10 transition hover:ring-primary/40"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Email
                  </p>
                  <p className="mt-2 break-all text-sm font-medium text-secondary">
                    {currentArtist.email}
                  </p>
                </a>
              )}
            </div>
            <a
              href={quickEnquiryUrl(undefined, currentArtist.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary p-5 font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary-dark"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>

          <div className="min-h-[320px] overflow-hidden rounded-2xl shadow-sm ring-1 ring-primary/10">
            {currentArtist.googleMapsEmbedUrl && (
              <iframe
                src={currentArtist.googleMapsEmbedUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Studio location on Google Maps"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
