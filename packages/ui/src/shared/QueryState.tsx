"use client";

import type { ReactNode } from "react";
import { Skeleton } from "../components/skeleton";
import { InfoNotice } from "./InfoNotice";

interface QueryStateProps {
  /** True while the first fetch is in flight. */
  isLoading?: boolean;
  /** The query's error, if the fetch failed. */
  error?: { message?: string } | null;
  /** True when the fetch succeeded but returned nothing. */
  isEmpty?: boolean;
  /** Shown instead of the default skeleton rows while loading. */
  loading?: ReactNode;
  /** Number of default skeleton rows. Ignored when `loading` is given. */
  skeletonRows?: number;
  /** Height class for the default skeleton rows. */
  skeletonClassName?: string;
  /** Shown when the query succeeded with no rows. */
  empty?: ReactNode;
  /** Rendered once the query has data. */
  children?: ReactNode;
}

/**
 * Loading, error, and empty handling for a query-backed view.
 *
 * A failed request and an empty result are different things, and rendering a
 * failure as "no records yet" hides real breakage: a caregiver list that was
 * 400ing read as a patient with no caregivers. This keeps the two apart so a
 * broken endpoint looks broken.
 */
export default function QueryState({
  isLoading,
  error,
  isEmpty,
  loading,
  skeletonRows = 3,
  skeletonClassName = "h-20 w-full rounded-xl",
  empty,
  children,
}: QueryStateProps) {
  if (isLoading) {
    if (loading) return <>{loading}</>;
    return (
      <div className="space-y-3">
        {Array.from({ length: skeletonRows }).map((_, i) => (
          <Skeleton key={i} className={skeletonClassName} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <InfoNotice
        variant="error"
        message={
          error.message ??
          "Could not load this data. Please refresh and try again."
        }
      />
    );
  }

  if (isEmpty) return <>{empty}</>;

  return <>{children}</>;
}
