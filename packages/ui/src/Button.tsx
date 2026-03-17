"use client";

import { cn } from "./cn";
import { motion } from "motion/react";
import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Full width on mobile, auto on desktop */
  fullWidth?: boolean;
  /** Shows a loading spinner and disables the button */
  loading?: boolean;
  href?: string;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      fullWidth = false,
      loading = false,
      className,
      children,
      disabled,
      href,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "relative inline-flex items-center justify-center font-body font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:pointer-events-none disabled:opacity-50";

    const variants: Record<ButtonVariant, string> = {
      primary:
        "bg-gold text-obsidian px-8 py-4 text-sm uppercase tracking-[0.06em] hover:bg-cream",
      ghost:
        "text-muted hover:text-cream px-0 py-2 text-sm tracking-wide underline-offset-4 hover:underline",
    };

    const classes = cn(
      baseClasses,
      variants[variant],
      fullWidth && "w-full",
      className
    );

    if (href) {
      return (
        <motion.a
          href={href}
          className={classes}
          whileTap={{ scale: variant === "primary" ? 0.98 : 1 }}
        >
          {children}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        whileTap={{ scale: variant === "primary" ? 0.98 : 1 }}
        onClick={props.onClick}
        type={props.type}
      >
        {loading && (
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        <span className={cn(loading && "invisible")}>{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
