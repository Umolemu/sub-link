"use client";

import { type InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={clsx(
        "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black transition-colors duration-150",
        className
      )}
      {...props}
    />
  );
};
