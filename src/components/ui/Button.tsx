"use client";

import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  fullWidth?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "rounded-md font-medium transition-all duration-200 focus:outline-none active:scale-[0.98]";

  const variants = {
    primary:
      "bg-[var(--brand-red)] text-white hover:bg-red-700 disabled:opacity-60",
    outline:
      "border border-[var(--brand-red)] text-[var(--brand-red)] hover:bg-[var(--brand-red)] hover:text-white",
    ghost:
      "text-[var(--brand-red)] hover:bg-red-50 disabled:opacity-60",
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        fullWidth && "w-full",
        "px-5 py-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
