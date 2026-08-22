import type { PropsWithChildren } from "react";

import { FloatingBookAppointmentButton } from "@/components/shared/floating-book-appointment-button";
import { MobileFooter } from "@/components/shared/mobile-footer";
import { PublicHeader } from "@/components/shared/public-header";
import { Screen } from "@/components/ui/screen";

export function PublicPageLayout({ children }: PropsWithChildren) {
  return (
    <Screen
      stickyHeader={<PublicHeader />}
      overlay={<FloatingBookAppointmentButton />}
    >
      {children}
      <MobileFooter />
    </Screen>
  );
}
