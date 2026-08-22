import type { UserRole } from "@workspace/contracts";
import {
  patientSidebarMenu,
  type AppNavGroup,
} from "@workspace/shared/constants";

export const adminSidebarMenu: AppNavGroup[] = [
  {
    groupLabel: "CARE OPERATIONS",
    items: [
      {
        label: "People",
        icon: "IconUsers",
        children: [
          {
            label: "Providers",
            href: "/admin/providers",
          },
          {
            label: "Patients",
            href: "/patients",
          },
          {
            label: "Staff",
            href: "/admin/staff",
          },
          {
            label: "Users",
            href: "/admin/users",
          },
        ],
      },
      {
        label: "Scheduling",
        icon: "IconCalendarTime",
        children: [
          {
            label: "Appointments",
            href: "/appointments",
          },
          {
            label: "Messages",
            href: "/messages",
            icon: "IconMessageCircle",
          },
        ],
      },
    ],
  },

  {
    groupLabel: "PSYCHIATRIC CLINICAL",
    items: [
      {
        label: "Clinical Records",
        icon: "IconClipboardList",
        children: [
          { label: "Treatment Plans", href: "/clinical/treatment-plans" },
          { label: "Progress Notes", href: "/clinical/session-notes" },
          { label: "Authorizations", href: "/clinical/authorizations" },
          { label: "Progress Reports", href: "/clinical/progress-reports" },
          { label: "Caregivers", href: "/clinical/caregivers" },
          {
            label: "Caregiver Invitations",
            href: "/admin/clinical/caregivers/invitations",
          },
        ],
      },
      {
        label: "Patient Assessments",
        icon: "IconStethoscope",
        children: [
          { label: "Intake Forms", href: "/clinical/intake-forms" },
          { label: "Screening Results", href: "/clinical/screening-results" },
          { label: "Teacher Assessments", href: "/clinical/teacher-assessments" },
        ],
      },
      {
        label: "Provider Caseloads",
        href: "/admin/clinical/staff-caseloads",
        icon: "IconUsersGroup",
      },
    ],
  },

  {
    groupLabel: "BILLING & OUTREACH",
    items: [
      {
        label: "Payments",
        href: "/admin/payments",
        icon: "IconCreditCard",
      },
      {
        label: "Campaigns",
        href: "/admin/campaigns",
        icon: "IconBolt",
      },
      {
        label: "Newsletter",
        href: "/admin/leads/subscribers",
        icon: "IconAddressBook",
      },
      {
        label: "Contact Messages",
        href: "/admin/leads/messages",
        icon: "IconMessageCircle",
      },
    ],
  },

  {
    groupLabel: "CONTENT & INSIGHTS",
    items: [
      {
        label: "Content",
        icon: "IconFileText",
        children: [
          {
            label: "Blog Posts",
            href: "/content/posts",
          },
          {
            label: "Categories",
            href: "/content/categories",
          },
          {
            label: "Careers",
            href: "/admin/careers",
          },
          {
            label: "Testimonials",
            href: "/admin/testimonials",
          },
        ],
      },
      {
        label: "Media",
        href: "/media",
        icon: "IconPhoto",
      },
      {
        label: "Analytics",
        icon: "IconChartBar",
        children: [
          {
            label: "Traffic Sources",
            href: "/admin/traffic-sources",
          },
          {
            label: "Audit Logs",
            href: "/admin/audit-logs",
          },
        ],
      },
    ],
  },

  {
    groupLabel: "SYSTEM",
    items: [
      {
        label: "Branches",
        href: "/admin/branches",
        icon: "IconMapPin",
      },
      {
        label: "Business Profile",
        href: "/admin/business-profile",
        icon: "IconSettings",
      },
    ],
  },
];

/**
 * An author account exists only to write posts, so its navigation carries the
 * content tools and nothing that touches patients or clinical records.
 */
export const authorSidebarMenu: AppNavGroup[] = [
  {
    groupLabel: "CONTENT",
    items: [
      {
        label: "Posts",
        href: "/content/posts",
        icon: "IconClipboardList",
      },
      {
        label: "Categories",
        href: "/content/categories",
        icon: "IconClipboardList",
      },
      {
        label: "Media",
        href: "/media",
        icon: "IconPhoto",
      },
    ],
  },
];

/** Build the staff sidebar filtered to only the modules the user has been granted. */
export const getStaffSidebarMenu = (permissions: string[]): AppNavGroup[] => {
  const has = (mod: string) => permissions.includes(mod);

  const careItems: AppNavGroup["items"] = [];
  if (has("patients")) careItems.push({ label: "Patients", href: "/patients", icon: "IconUsersGroup" });
  if (has("appointments")) careItems.push({ label: "Appointments", href: "/appointments", icon: "IconCalendarTime" });
  if (has("messages")) careItems.push({ label: "Messages", href: "/messages", icon: "IconMessageCircle" });
  if (has("clinical")) {
    careItems.push({
      label: "Clinical Records",
      icon: "IconClipboardList",
      children: [
        { label: "Treatment Plans", href: "/clinical/treatment-plans" },
        { label: "Progress Notes", href: "/clinical/session-notes" },
        { label: "Authorizations", href: "/clinical/authorizations" },
        { label: "Progress Reports", href: "/clinical/progress-reports" },
        { label: "Caregivers", href: "/clinical/caregivers" },
      ],
    });
    careItems.push({
      label: "Patient Assessments",
      icon: "IconStethoscope",
      children: [
        { label: "Intake Forms", href: "/clinical/intake-forms" },
        { label: "Screening Results", href: "/clinical/screening-results" },
        { label: "Teacher Assessments", href: "/clinical/teacher-assessments" },
      ],
    });
  }

  const toolItems: AppNavGroup["items"] = [];
  if (has("content")) {
    toolItems.push({
      label: "Content",
      icon: "IconFileText",
      children: [
        { label: "Blog Posts", href: "/content/posts" },
        { label: "Categories", href: "/content/categories" },
      ],
    });
  }
  if (has("media")) toolItems.push({ label: "Media", href: "/media", icon: "IconPhoto" });
  if (has("payments")) toolItems.push({ label: "Payments", href: "/admin/payments", icon: "IconCreditCard" });
  toolItems.push({ label: "Profile", href: "/staff/profile", icon: "IconUserCircle" });

  const groups: AppNavGroup[] = [];
  if (careItems.length) groups.push({ groupLabel: "CARE OPERATIONS", items: careItems });
  if (toolItems.length) groups.push({ groupLabel: "TOOLS", items: toolItems });
  return groups;
};

export const getSidebarMenu = (role: UserRole, permissions?: string[]): AppNavGroup[] => {
  switch (role) {
    case "admin":
      return adminSidebarMenu;

    case "author":
      return authorSidebarMenu;

    case "staff":
      return getStaffSidebarMenu(permissions ?? []);

    case "patient":
      return patientSidebarMenu;

    default:
      throw new Error("Invalid Role");
  }
};
