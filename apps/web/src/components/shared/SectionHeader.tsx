import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  className?: string;
  align?: "default" | "center";
}

const SectionHeader = ({
  title,
  eyebrow,
  description,
  className,
  align = "default",
}: SectionHeaderProps) => {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "max-w-2xl",
        isCenter && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-forest">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-primary text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl",
          eyebrow && "mt-3",
        )}
      >
        {title}
      </h2>

      {description && (
        <p className="mt-4 font-secondary text-base leading-7 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
