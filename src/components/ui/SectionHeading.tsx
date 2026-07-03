import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-14 max-w-2xl",
        align === "center" && "mx-auto text-center"
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-serif text-3xl md:text-4xl font-semibold",
          light ? "text-white" : "text-secondary"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-3 text-base", light ? "text-white/80" : "text-foreground/70")}>
          {subtitle}
        </p>
      )}
      <span
        className={cn(
          "mt-5 flex items-center gap-2 text-primary",
          align === "center" && "justify-center"
        )}
        aria-hidden="true"
      >
        <span className="h-px w-10 bg-current opacity-50" />
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
          <path d="M12 0c.6 6.5 5.5 11.4 12 12-6.5.6-11.4 5.5-12 12-.6-6.5-5.5-11.4-12-12C6.5 11.4 11.4 6.5 12 0z" />
        </svg>
        <span className="h-px w-10 bg-current opacity-50" />
      </span>
    </div>
  );
}
