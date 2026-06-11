"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive" | "gradient" | "charcoal";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#C4622D] text-white hover:bg-[#A5511F] active:bg-[#8E4419] shadow-sm shadow-orange-500/20",
  gradient:
    "bg-gradient-to-r from-[#C4622D] to-[#E8943A] text-white hover:from-[#A5511F] hover:to-[#D4823A] shadow-sm shadow-orange-500/25",
  charcoal:
    "bg-[#2D2D2D] text-white hover:bg-[#1a1a1a] active:bg-black shadow-sm",
  secondary:
    "bg-[#f5f4f0] text-[#2D2D2D] hover:bg-[#ece9e3] dark:bg-[#2a2824] dark:text-[#f5f4f0] dark:hover:bg-[#333028]",
  ghost:
    "text-[#4D4D4D] hover:bg-[#f5f4f0] dark:text-[#d1cfc9] dark:hover:bg-[#2a2824]",
  outline:
    "border border-[#e8e8e4] text-[#2D2D2D] hover:bg-[#f7f6f3] hover:border-[#C4622D] dark:border-[#2a2824] dark:text-[#f5f4f0] dark:hover:bg-[#2a2824]",
  destructive:
    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm",
};

const sizes: Record<ButtonSize, string> = {
  sm:   "h-8 px-3 text-sm rounded-lg gap-1.5",
  md:   "h-10 px-4 text-sm rounded-xl gap-2",
  lg:   "h-12 px-6 text-base rounded-xl gap-2",
  icon: "h-10 w-10 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, icon, iconRight, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : icon && <span className="shrink-0">{icon}</span>}
        {children}
        {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
