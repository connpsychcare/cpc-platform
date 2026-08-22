"use client";
import PatientDetailLayoutShell from "@/components/dashboard/patients/PatientDetailLayoutShell";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({ children, params }: LayoutProps<"/patients/[id]">) => {
  const { id } = React.use(params);
  const pathname = usePathname();

  const isExactEditRoute = pathname === `/patients/${id}/edit`;

  return isExactEditRoute ? (
    children
  ) : (
    <PatientDetailLayoutShell patientId={id}>
      {children}
    </PatientDetailLayoutShell>
  );
};

export default Layout;
