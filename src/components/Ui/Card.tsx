import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils";

/**
 * XipSoft — glassmorphism Kart Sistemi
 *
 * Varyantlar:
 *  - default  → glass-card (backdrop-blur, oval köse, LED hover)
 *  - flat     → düz yüzey, blur yok (tablo satırları vb.)
 *  - outline  → sadece border, seffaf arka plan
 */

const Card = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { variant?: "default" | "flat" | "outline" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Temel
      "relative rounded-2xl transition-all duration-500",
      // Varyant stilleri
      variant === "default" && [
        "glass-card",
        "hover:-translate-y-1",
        "hover:shadow-[0_16px_48px_-8px_rgba(249,115,22,0.12),0_8px_24px_-4px_rgba(0,0,0,0.25)]",
      ],
      variant === "flat" && [
        "bg-white/[0.03] border border-white/[0.06]",
        "hover:bg-white/[0.05] hover:border-white/[0.10]",
      ],
      variant === "outline" && [
        "border border-white/[0.08] bg-transparent",
        "hover:border-white/[0.16]",
      ],
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const GlassCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("glass-card relative overflow-hidden rounded-2xl", className)}
      {...props}
    />
  )
);
GlassCard.displayName = "GlassCard";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6 md:p-8", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl md:text-2xl font-bold leading-tight tracking-tight text-zinc-100",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm md:text-base text-zinc-400 leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 md:p-8 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-6 md:p-8 pt-0 border-t border-white/[0.05] mt-2",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  GlassCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
