import { faqs } from "@/data/faqs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function FaqSection() {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
        />
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={faq.question} delay={i * 0.08}>
            <details
              className="faq group rounded-2xl bg-white shadow-sm ring-1 ring-primary/10"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-sm font-semibold text-secondary">
                {faq.question}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-primary transition-transform duration-200 group-open:rotate-45">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="px-6 pb-5 text-sm leading-relaxed text-foreground/70">
                {faq.answer}
              </p>
            </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
