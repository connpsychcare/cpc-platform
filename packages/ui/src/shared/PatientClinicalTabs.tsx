"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserRound,
  ClipboardList,
  FileText,
  ShieldCheck,
  Users,
  BarChart2,
  BookOpenCheck,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import type { UserRole } from "@workspace/contracts";

interface Tab {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
  exact?: boolean;
}

const buildTabs = (patientId: string): Tab[] => [
  {
    label: "Overview",
    href: `/patients/${patientId}`,
    icon: UserRound,
    roles: ["admin", "staff"],
    exact: true,
  },
  {
    label: "Treatment Plans",
    href: `/patients/${patientId}/treatment-plans`,
    icon: ClipboardList,
    roles: ["admin", "staff"],
  },
  {
    label: "Session Notes",
    href: `/patients/${patientId}/session-notes`,
    icon: FileText,
    roles: ["admin", "staff"],
  },
  {
    label: "Authorizations",
    href: `/patients/${patientId}/authorizations`,
    icon: ShieldCheck,
    roles: ["admin", "staff"],
  },
  {
    label: "Caregivers",
    href: `/patients/${patientId}/caregivers`,
    icon: Users,
    roles: ["admin", "staff"],
  },
  {
    label: "Progress Reports",
    href: `/patients/${patientId}/progress-reports`,
    icon: BarChart2,
    roles: ["admin", "staff"],
  },
  {
    label: "Assessments",
    href: `/patients/${patientId}/assessments`,
    icon: ClipboardCheck,
    roles: ["admin", "staff"],
  },
  {
    label: "Teacher Assessments",
    href: `/patients/${patientId}/teacher-assessments`,
    icon: BookOpenCheck,
    roles: ["admin", "staff"],
  },
];

interface PatientClinicalTabsProps {
  patientId: string;
  role?: UserRole | null;
  className?: string;
}

const PatientClinicalTabs = ({
  patientId,
  role,
  className,
}: PatientClinicalTabsProps) => {
  const pathname = usePathname();
  const tabs = buildTabs(patientId).filter(
    (t) => !role || t.roles.includes(role),
  );

  return (
    <div
      className={cn(
        "flex flex-wrap gap-1 rounded-xl border bg-muted/40 p-1",
        className,
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.exact
          ? pathname === tab.href || pathname.startsWith(`${tab.href}/edit`)
          : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default PatientClinicalTabs;
