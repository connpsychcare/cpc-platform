"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, MenuIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import Logo from "@workspace/ui/shared/Logo";
import { headerNavigation } from "@workspace/shared/constants";
import { appIconMap } from "@workspace/ui/lib/icons";

const MobileNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [openSections, setOpenSections] = React.useState<string[]>([]);

  const closeMenu = () => setIsOpen(false);

  const isMenuItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <MenuIcon className="size-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full max-w-sm gap-0 p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b px-5 py-5 text-left">
            <Logo size="lg" />
            <SheetTitle className="sr-only">Navigation</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {headerNavigation.map((item) => {
                const hasChildren = !!item.children?.length;

                const isSectionActive =
                  (item.href ? isMenuItemActive(item.href) : false) ||
                  (hasChildren
                    ? item.children!.some((child) =>
                        isMenuItemActive(child.href),
                      )
                    : false);

                const isSectionOpen =
                  openSections.includes(item.title) || isSectionActive;

                const Icon = item.icon ? appIconMap[item.icon] : null;

                if (!hasChildren) {
                  return (
                    <Link
                      key={item.title}
                      href={item.href ?? "#"}
                      onClick={closeMenu}
                      className={cn(
                        "flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-medium transition",
                        isSectionActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted active:bg-muted",
                      )}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            "size-4.5 shrink-0",
                            isSectionActive ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                      )}
                      <span>{item.title}</span>
                    </Link>
                  );
                }

                return (
                  <Collapsible
                    key={item.title}
                    open={isSectionOpen}
                    onOpenChange={() => toggleSection(item.title)}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-medium transition",
                        isSectionActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted active:bg-muted",
                      )}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            "size-4.5 shrink-0",
                            isSectionActive ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                      )}

                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="flex-1"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <span className="flex-1">{item.title}</span>
                      )}

                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          aria-label={`Toggle ${item.title} links`}
                          className="flex size-8 items-center justify-center"
                        >
                          <ChevronDown
                            className={cn(
                              "size-4 transition",
                              isSectionOpen && "rotate-180",
                            )}
                          />
                        </button>
                      </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="px-2 pb-2 pt-1">
                      <div className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-background p-2">
                        {item.children!.map((child) => {
                          const Icon = child.icon
                            ? appIconMap[child.icon]
                            : null;
                          const isChildActive = isMenuItemActive(child.href);

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={closeMenu}
                              className={cn(
                                "flex items-start gap-3 rounded-xl px-3 py-3 transition",
                                isChildActive
                                  ? "bg-primary/10"
                                  : "hover:bg-muted",
                              )}
                            >
                              <div
                                className={cn(
                                  "flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
                                  isChildActive && "bg-primary/15",
                                )}
                              >
                                {Icon && <Icon className="size-4.5" />}
                              </div>

                              <div className="flex flex-col gap-1">
                                <span
                                  className={cn(
                                    "text-sm font-medium",
                                    isChildActive ? "text-primary" : "text-foreground",
                                  )}
                                >
                                  {child.title}
                                </span>
                                <span className="text-xs leading-5 text-muted-foreground">
                                  {child.description}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
