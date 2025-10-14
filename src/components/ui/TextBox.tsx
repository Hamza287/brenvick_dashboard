"use client";

import clsx from "clsx";

interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  textarea?: boolean;
  rows?: number;
}

export default function TextBox({
  label,
  textarea = false,
  rows = 3,
  className,
  ...props
}: TextBoxProps) {
  const baseStyles =
    "w-full p-2.5 border border-gray-300 rounded-md text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--brand-red)] focus:border-[var(--brand-red)]";

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {textarea ? (
        <textarea
          rows={rows}
          className={clsx(baseStyles, className)}
          {...(props as any)}
        />
      ) : (
        <input
          className={clsx(baseStyles, className)}
          {...(props as any)}
        />
      )}
    </div>
  );
}
