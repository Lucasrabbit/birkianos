"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-serif rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
      primary:
        "bg-birk-ink text-birk-paper hover:bg-birk-ink-soft active:scale-95",
      secondary:
        "bg-birk-paper text-birk-ink border border-birk-edge hover:bg-birk-paper-deep shadow-soft active:scale-95",
      ghost:
        "bg-transparent text-birk-ink-soft hover:text-birk-ink hover:bg-birk-paper active:scale-95",
      danger:
        "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 active:scale-95",
    };

    const sizes = {
      sm: "text-sm px-4 py-2",
      md: "text-sm px-5 py-2.5",
      lg: "text-base px-6 py-3",
    };

    const hoverAnimation =
      variant === "primary" && !disabled && !loading
        ? { x: -1, y: -2, boxShadow: "3px 5px 0 #b4533a" }
        : variant === "secondary" && !disabled && !loading
        ? { y: -1 }
        : {};

    return (
      <motion.button
        ref={ref}
        whileHover={hoverAnimation}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
