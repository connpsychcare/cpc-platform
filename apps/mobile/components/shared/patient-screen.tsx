import type { PropsWithChildren, ReactNode } from "react";

import { Screen } from "@/components/ui/screen";

const PATIENT_SAFE_AREA_EDGES = ["left", "right", "bottom"] as const;

export function PatientScreen({
  children,
  overlay,
}: PropsWithChildren<{ overlay?: ReactNode }>) {
  return (
    <Screen safeAreaEdges={PATIENT_SAFE_AREA_EDGES} overlay={overlay}>
      {children}
    </Screen>
  );
}
