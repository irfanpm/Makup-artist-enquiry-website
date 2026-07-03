import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "whatsapp" | "outline" | "light";

const styles: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/25",
  whatsapp:
    "bg-whatsapp text-white hover:brightness-95 shadow-md shadow-whatsapp/25",
  outline:
    "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  light:
    "bg-white/95 text-secondary hover:bg-white shadow-md",
};

interface ButtonProps {
  href: string;
  variant?: Variant;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  href,
  variant = "primary",
  external = false,
  className,
  children,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5",
    styles[variant],
    className
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
