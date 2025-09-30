// components/ui/Card.tsx
import { ReactNode } from "react";
import clsx from "clsx";

type CardProps = {
  title?: string;
  description?: string;
  image?: string;
  footer?: ReactNode;
  children?: ReactNode; // For custom content inside
  className?: string;
};

export default function Card({
  title,
  description,
  image,
  footer,
  children,
  className,
}: CardProps) {
  return (
    <div
      className={clsx(
        "w-full max-w-sm border border-gray-200 rounded-[5px] shadow-sm p-5 flex flex-col gap-3 bg-white",
        className
      )}
    >
      {/* Image Section (optional) */}
      {image && (
        <div className="flex justify-center">
          <img
            src={image}
            alt={title || "Card image"}
            className="object-contain max-h-40"
          />
        </div>
      )}

      {/* Title */}
      {title && <h3 className="text-lg font-semibold">{title}</h3>}

      {/* Description */}
      {description && <p className="text-sm text-gray-600">{description}</p>}

      {/* Custom Content */}
      {children}

      {/* Footer (e.g., button, link, etc.) */}
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}
