"use client";
import Link from "next/link";
import Image from "next/image";
import { cn } from "../lib/utils";

interface LogoProps {
  href?: string;
  size?: "default" | "sm" | "lg";
  variant?: "light" | "dark";
  className?: string;
}

const Logo = ({
  href = "/",
  variant = "light",
  size = "default",
  className,
}: LogoProps) => {
  const isDark = variant === "dark";

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 shrink-0",
        size === "sm" && "gap-2",
        size === "lg" && "gap-3",
        className,
      )}
      aria-label="Connected Psychiatric Care - Home"
    >
      {/* Icon mark */}
      <Image
        src="/images/logo.png"
        alt="Connected Psychiatric Care"
        width={64}
        height={64}
        className={cn(
          "shrink-0 object-contain",
          size === "sm" && "h-12 w-12",
          size === "default" && "h-14 w-14",
          size === "lg" && "h-16 w-16",
        )}
      />

      {/* Wordmark */}
      <div
        className={cn(
          "flex flex-col leading-none",
          size === "sm" && "gap-[1px]",
          size === "default" && "gap-[2px]",
          size === "lg" && "gap-1",
        )}
      >
        <span
          className={cn(
            "font-bold tracking-tight",
            size === "sm" && "text-sm",
            size === "default" && "text-[15px]",
            size === "lg" && "text-lg",
            isDark ? "text-white" : "text-[#0D1B3E] dark:text-white",
          )}
        >
          Connected,
        </span>
        <span
          className={cn(
            "font-semibold tracking-widest uppercase",
            size === "sm" && "text-[8px]",
            size === "default" && "text-[9px]",
            size === "lg" && "text-[11px]",
          )}
          style={{ color: "#1659DB" }}
        >
          Psychiatric Care
        </span>
      </div>
    </Link>
  );
};

export default Logo;
