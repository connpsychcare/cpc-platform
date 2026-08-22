"use client";

import Link from "next/link";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";

import type { AppNavGroup, AppNavItem } from "@workspace/shared/constants";
import type { ReactNode } from "react";
import { appIconMap } from "@workspace/ui/lib/icons";

interface DropdownNavProps extends React.ComponentProps<
  typeof DropdownMenuContent
> {
  header?: ReactNode;
  footer?: ReactNode;
  groups: AppNavGroup[];
  onItemClick?: () => void;
}

interface DropdownItemProps {
  item: AppNavItem;
  onItemClick?: () => void;
}

const DropdownItem = ({ item, onItemClick }: DropdownItemProps) => {
  const Icon = item.icon ? appIconMap[item.icon] : null;

  if (item.children?.length) {
    return (
      <>
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {item.label}
        </DropdownMenuLabel>

        {item.children.map((child) => {
          const Icon = child.icon ? appIconMap[child.icon] : null;
          return (
            <DropdownMenuItem
              key={child.label}
              asChild
              onClick={onItemClick}
              className="cursor-pointer pl-4"
            >
              <Link href={child.href || ""}>
                {Icon && <Icon />}
                {child.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </>
    );
  }

  // Normal item
  return (
    <DropdownMenuItem asChild onClick={onItemClick} className="cursor-pointer">
      <Link href={item.href || ""}>
        {Icon && <Icon />}
        {item.label}
      </Link>
    </DropdownMenuItem>
  );
};

const DropdownNav = ({
  header,
  footer,
  groups,
  onItemClick,
  ...props
}: DropdownNavProps) => {
  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      align="end"
      sideOffset={4}
      {...props}
    >
      {header && (
        <>
          {header}
          <DropdownMenuSeparator />
        </>
      )}
      {groups.map((group, groupIndex) => (
        <div key={groupIndex}>
          {/* Group Label */}
          {group.groupLabel && (
            <DropdownMenuLabel>{group.groupLabel}</DropdownMenuLabel>
          )}

          <DropdownMenuGroup>
            {group.items.map((item) => (
              <DropdownItem
                key={item.label}
                item={item}
                onItemClick={onItemClick}
              />
            ))}
          </DropdownMenuGroup>

          {/* Separator between groups */}
          {groupIndex !== groups.length - 1 && <DropdownMenuSeparator />}
        </div>
      ))}
      {footer && (
        <>
          <DropdownMenuSeparator />
          {footer}
        </>
      )}
    </DropdownMenuContent>
  );
};

export default DropdownNav;
