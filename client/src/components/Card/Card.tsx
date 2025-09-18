"use client";

import { type PropsWithChildren } from "react";
import clsx from "clsx";

export const Card = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={clsx("bg-white shadow rounded-lg overflow-hidden", className)}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={clsx("px-6 py-4", className)}>{children}</div>
  );
};

export const CardTitle = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <h2 className={clsx("text-lg font-bold text-black", className)}>
      {children}
    </h2>
  );
};

export const CardDescription = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return <p className={clsx("text-gray-600 text-sm", className)}>{children}</p>;
};

export const CardContent = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return <div className={clsx("px-6 py-4", className)}>{children}</div>;
};
