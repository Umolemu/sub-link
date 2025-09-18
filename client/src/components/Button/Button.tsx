"use client";

import { type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  // Variants centralize visual styles so consuming components avoid repeating utility classes.
  // primary: main solid button (previously called default)
  // secondary: solid alternative (currently same palette; can be adjusted later)
  // outline: bordered neutral button
  // ghost: minimal, subtle hover background
  variant?: "primary" | "secondary" | "ghost" | "outline" | "table";
};

export const Button = ({
  variant = "primary", // primary is now the default when none is provided
  className,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium transition-colors duration-150 active:outline-none active:ring-2 active:ring-offset-2";

  const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: "bg-gray-900 text-white hover:bg-black",
    secondary: "bg-black text-white hover:bg-gray-800",
    ghost: "bg-transparent text-black hover:bg-gray-100",
    outline: "border border-gray-300 text-black hover:bg-gray-100 bg-transparent",
    table: "px-3 py-1 text-sm border border-gray-300 text-black hover:bg-gray-100 bg-white",
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  );
};
