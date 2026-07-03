import { cn } from "@/lib/utils";

export default function Rating({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 text-gold", className)}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          className={cn("h-4 w-4", star <= Math.round(value) ? "fill-gold" : "fill-gold/25")}
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.366-2.445a1 1 0 00-1.176 0l-3.367 2.445c-.783.57-1.838-.196-1.538-1.118l1.286-3.957a1 1 0 00-.363-1.118L2.577 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.287-3.958z" />
        </svg>
      ))}
    </span>
  );
}
