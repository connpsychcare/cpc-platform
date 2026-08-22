"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@workspace/ui/components/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import type { AppNavGroup, AppNavItem } from "@workspace/shared/constants";
import { appIconMap } from "@workspace/ui/lib/icons";

interface SidebarNavProps {
  closeSidebar: () => void;
  groups: AppNavGroup[];
  pathname: string;
}

const isItemActive = (pathname: string, item: AppNavItem): boolean => {
  if (item.href) {
    if (pathname === item.href) return true;
    if (item.href !== "/" && pathname.startsWith(`${item.href}/`)) return true;
  }

  return (
    item.children?.some((child: AppNavItem) => isItemActive(pathname, child)) ??
    false
  );
};

const SidebarNav = ({ closeSidebar, groups, pathname }: SidebarNavProps) => {
  return groups.map(({ items, groupLabel }, i) => (
    <SidebarGroup
      key={i}
      className={cn(i === groups.length - 1 ? "mt-auto" : "")}
    >
      <SidebarGroupContent className="flex flex-col gap-2">
        {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon ? appIconMap[item.icon] : null;

            return (
              <Collapsible
                key={item.label}
                asChild
                defaultOpen={isItemActive(pathname, item)}
                className="group/collapsible"
              >
                <SidebarMenuItem key={item.label}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.label}
                      className={cn(
                        isItemActive(pathname, item) &&
                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear",
                      )}
                      asChild
                    >
                      {item.children ? (
                        <div className="cursor-pointer">
                          {Icon && <Icon />}
                          <span>{item.label}</span>
                          {item.children && (
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </div>
                      ) : (
                        <Link href={item.href!} onClick={closeSidebar}>
                          {Icon && <Icon />}
                          <span>{item.label}</span>
                          {item.badge != null && item.badge > 0 && (
                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                              {item.badge > 99 ? "99+" : item.badge}
                            </span>
                          )}
                          {item.children && (
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.children && (
                      <SidebarMenuSub>
                        {item.children.map((i) => (
                          <SidebarMenuSubItem key={i.label}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isItemActive(pathname, i)}
                            >
                              <Link href={i.href || ""} onClick={closeSidebar}>
                                <span>{i.label}</span>
                                {i.badge != null && i.badge > 0 && (
                                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                                    {i.badge > 99 ? "99+" : i.badge}
                                  </span>
                                )}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
};

export default SidebarNav;
