import type { PropsWithChildren, ReactNode } from "react";
import { Screen } from "@/components/ui/screen";

const SAFE_AREA_EDGES = ["left", "right", "bottom"] as const;

export function InternalScreen({
  children,
  overlay,
}: PropsWithChildren<{ overlay?: ReactNode }>) {
  return (
    <Screen safeAreaEdges={SAFE_AREA_EDGES} overlay={overlay}>
      {children}
    </Screen>
  );
}
