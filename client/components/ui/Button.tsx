"use client";

import React, { ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants: Record<ButtonVariant, string> = {
      primary:
        "bg-cayenne-red-500 text-white hover:bg-cayenne-red-600 focus-visible:ring-cayenne-red-500 shadow-sm",
      secondary:
        "bg-carbon-black-100 text-carbon-black-800 hover:bg-carbon-black-200 focus-visible:ring-carbon-black-500",
      outline:
        "border-2 border-cayenne-red-500 text-cayenne-red-600 hover:bg-cayenne-red-50 focus-visible:ring-cayenne-red-500 bg-transparent",
      ghost:
        "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500 bg-transparent",
      danger:
        "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-sm",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10 p-2", // square button for icons only
    };

    const combinedClasses = `cursor-pointer ${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={combinedClasses}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);

export default Button;