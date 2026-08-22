import type { Href } from "expo-router";
import type { AppIconName } from "@/lib/icons";
import {
  headerNavigation,
  patientDropdownMenu,
  patientSidebarMenu,
} from "@workspace/shared/constants";

const route = (href?: string) => href as Href;

export function getRoleDashboardHref(role?: string | null): Href {
  switch (role) {
    case "admin":
      return route("/admin");
    case "provider":
      return route("/provider");
    case "staff":
      return route("/staff");
    case "patient":
      return route("/patient");
    default:
      return route("/");
  }
}

export const primaryTabs = [
  { href: route("/"), label: "Home", icon: "IconHome" },
  { href: route("/providers"), label: "Providers", icon: "IconStethoscope" },
  { href: route("/account"), label: "Account", icon: "IconUserCircle" },
] as const satisfies readonly {
  href: Href;
  label: string;
  icon: AppIconName;
}[];

export const patientDropdownGroups = patientDropdownMenu.map((group) => ({
  ...group,
  items: group.items.map((item) => ({
    ...item,
    href: route(item.href),
  })),
}));

export const publicNavigation = headerNavigation.map((item) => ({
  ...item,
  href: item.href ? route(item.href) : undefined,
  children: item.children?.map((child) => ({
    ...child,
    href: route(child.href),
  })),
}));

export const patientOverviewItem = {
  href: route("/patient"),
  label: "Overview",
  icon: "LayoutDashboardIcon",
} as const;

export const patientSidebarGroups = patientSidebarMenu.map((group) => ({
  groupLabel: group.groupLabel ?? "",
  items: group.items
    .filter((item) => item.href)
    .map((item) => {
      const href = item.href!;

      return {
        href: route(href),
        label: item.label,
        icon: item.icon,
      };
    }),
}));

export const patientSidebarFooterItems = [
  {
    href: route("/patient/account"),
    label: "Account & Settings",
    icon: "IconUserCircle",
  },
] as const;
