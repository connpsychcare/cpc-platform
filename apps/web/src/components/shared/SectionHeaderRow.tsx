import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import SectionHeader from "./SectionHeader";

interface SectionHeaderRowProps {
  eyebrow?: string;
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
}

/**
 * The "heading + quiet view-all link" row pattern reused across the home
 * services/team/resources sections - keeps the layout (and the quiet-link
 * styling) in one place instead of hand-rolled per section.
 */
export default function SectionHeaderRow({
  eyebrow,
  title,
  description,
  linkHref,
  linkLabel,
  className,
}: SectionHeaderRowProps) {
  return (
    <div className={cn("mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between", className)}>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-bold text-accent transition-all hover:gap-2"
        >
          {linkLabel} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
