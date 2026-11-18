import Link from "next/link";
import React from "react";
import { withBasePath } from "../../lib/site";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  clickable?: boolean;
}

export const DubaiStoreLogo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  clickable = true,
}) => {
  const sizeClasses = {
    sm: "h-8 sm:h-9",
    md: "h-10 sm:h-12",
    lg: "h-14 sm:h-16",
    xl: "h-20 sm:h-24",
  }[size];

  const content = (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* Exact official Dubai Store logo image provided by owner */}
      <img
        src={withBasePath("/logo.jpg")}
        alt="Dubai Store"
        className={`${sizeClasses} w-auto object-contain mix-blend-multiply`}
        loading="eager"
      />
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
};
