import { cn } from "@/lib/utils";

/** Four-point star used as a decorative accent. */
export default function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5 fill-current", className)}
      aria-hidden="true"
    >
      <path d="M12 0c.6 6.5 5.5 11.4 12 12-6.5.6-11.4 5.5-12 12-.6-6.5-5.5-11.4-12-12C6.5 11.4 11.4 6.5 12 0z" />
    </svg>
  );
}
