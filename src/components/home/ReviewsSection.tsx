import { featuredReviews, averageRating, reviews } from "@/data/reviews";
import SectionHeading from "@/components/ui/SectionHeading";
import Rating from "@/components/ui/Rating";
import Reveal from "@/components/ui/Reveal";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

export default function ReviewsSection() {
  return (
    <section id="reviews" className="bg-muted/60 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Brides Say"
          subtitle={`Rated ${averageRating} out of 5 by ${reviews.length * 24}+ happy customers`}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {featuredReviews.map((review, i) => (
            <Reveal key={review.customerName} delay={i * 0.15}>
              <figure className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10">
              <Rating value={review.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/75">
                “{review.message}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 font-serif font-semibold text-primary">
                  {initials(review.customerName)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-secondary">
                    {review.customerName}
                  </span>
                  {review.serviceName && (
                    <span className="block text-xs text-foreground/55">
                      {review.serviceName}
                    </span>
                  )}
                </span>
              </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
