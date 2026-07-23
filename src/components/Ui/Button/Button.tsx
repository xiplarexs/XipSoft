import React from "react";
import { cn } from "@/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "fire" | "prism" | "glass" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  glow?: boolean;
  accent?: string;
}

const Button = ({
  children,
  className = "",
  variant = "fire",
  size = "md",
  isLoading = false,
  glow = true,
  accent,
  style,
  ...props
}: ButtonProps) => {
  const base = cn(
    "relative inline-flex items-center justify-center gap-2 font-bold transition-all duration-300",
    "rounded-xl overflow-hidden",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "active:scale-95",
    "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none"
  );

  const variants: Record<string, string> = {
    fire: cn(
      "text-zinc-950 bg-[linear-gradient(90deg,var(--fire-rose),var(--fire-orange),var(--fire-yellow))]",
      "hover:scale-[1.03]",
      glow && "shadow-[0_0_20px_rgba(249,115,22,0.50)] hover:shadow-[0_0_32px_rgba(249,115,22,0.75),0_0_10px_rgba(251,191,36,0.35)]"
    ),
    prism: cn(
      "text-zinc-950 bg-[linear-gradient(90deg,var(--prism-violet),var(--prism-cyan),var(--prism-rose))]",
      "hover:scale-[1.03]",
      glow && "shadow-[0_0_20px_rgba(167,139,250,0.45)] hover:shadow-[0_0_32px_rgba(167,139,250,0.70)]"
    ),
    glass: cn(
      "text-zinc-200 border border-white/[0.12] bg-white/[0.05] backdrop-blur-md",
      "hover:border-orange-400/30 hover:bg-white/[0.08] hover:text-white",
      "before:hidden"
    ),
    outline: cn(
      "text-zinc-300 border border-white/[0.10] bg-transparent",
      "hover:border-white/[0.22] hover:text-white",
      "before:hidden"
    ),
    ghost: cn(
      "text-zinc-400 bg-transparent",
      "hover:text-white hover:bg-white/[0.05]",
      "before:hidden"
    ),
    danger: cn(
      "text-white bg-gradient-to-r from-red-500 to-rose-600",
      "hover:from-red-400 hover:to-rose-500",
      "hover:scale-[1.03]",
      glow && "shadow-[0_0_16px_rgba(239,68,68,0.40)]",
      "before:hidden"
    ),
  };

  const sizes: Record<string, string> = {
    sm:  "px-3 py-1.5 text-xs tracking-wide",
    md:  "px-5 py-2.5 text-sm tracking-wide",
    lg:  "px-7 py-3.5 text-sm tracking-wider",
    xl:  "px-8 py-4 text-base tracking-wider",
  };

  const accentBtnStyle = accent
    ? {
        background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
        boxShadow: glow ? `0 0 24px ${accent}40` : undefined,
        color: "#09090b",
        transition: "box-shadow 0.3s, transform 0.2s, filter 0.2s",
      }
    : undefined;

  const cls = accent ? cn(base, "hover:scale-[1.03]", sizes[size], className)
                    : cn(base, variants[variant], sizes[size], className);

  return (
    <button
      className={cls}
      style={accent ? accentBtnStyle : style}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

export default Button;
