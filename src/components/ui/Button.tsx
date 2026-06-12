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
    "bg-[#C4622D] text-white hover:bg-[#9E4D21] active:bg-[#1D44B8] shadow-sm shadow-blue-500/20",
  gradient:
    "bg-[#0d1117] text-white hover:bg-[#1c2433] active:bg-black shadow-md shadow-black/15 dark:bg-white dark:text-[#0d1117] dark:hover:bg-[#e8ecf5]",
  charcoal:
    "bg-[#0d1117] text-white hover:bg-[#1c2433] active:bg-black shadow-sm",
  secondary:
    "bg-[#f3f5fb] text-[#0d1117] hover:bg-[#e7ecf7] dark:bg-[#1a1f2b] dark:text-[#f4f6fb] dark:hover:bg-[#222838]",
  ghost:
    "text-[#41485a] hover:bg-[#f3f5fb] dark:text-[#c7ccd9] dark:hover:bg-[#1a1f2b]",
  outline:
    "border border-[#dfe4ef] text-[#0d1117] bg-white/60 backdrop-blur hover:bg-white hover:border-[#C4622D] dark:border-[#2a3142] dark:text-[#f4f6fb] dark:bg-white/5 dark:hover:bg-white/10",
  destructive:
    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm",
};

const sizes: Record<ButtonSize, string> = {
  sm:   "h-9 px-4 text-sm rounded-full gap-1.5",
  md:   "h-11 px-5 text-sm rounded-full gap-2",
  lg:   "h-[52px] px-7 text-base rounded-full gap-2",
  icon: "h-10 w-10 rounded-full",
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
