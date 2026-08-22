"use client";

import { CalendarDays } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";
import Logo from "@workspace/ui/shared/Logo";
import ThemeSwitch from "@workspace/ui/components/theme-toggle";
import FloatingCtas from "./FloatingCtas";
import MobileNav from "./MobileNav";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu";
import MegaMenu from "./MegaMenu";
import { headerNavigation } from "@workspace/shared/constants";
import AccountDropdown from "./AccountDropdown";

const Header = () => {
  const pathname = usePathname();
  const { currentUser } = useCurrentUser();

  const isMenuItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-xl">
        {/* `1fr auto 1fr` keeps the nav on the page centre line no matter how wide the
            logo or the action cluster grow. */}
        <div className="section flex items-center justify-between py-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none lg:justify-self-start">
            <MobileNav />
            <Logo className="max-sm:scale-[0.88] max-sm:origin-left" />
          </div>

          <NavigationMenu className="max-w-none hidden items-center gap-1 lg:flex lg:justify-self-center">
            <NavigationMenuList className="gap-1">
              {headerNavigation.map((item) => {
                const hasChildren = !!item.children?.length;

                const isActive =
                  (item.href ? isMenuItemActive(item.href) : false) ||
                  (hasChildren
                    ? item.children!.some((child) =>
                        isMenuItemActive(child.href),
                      )
                    : false);

                return (
                  <NavigationMenuItem key={item.title}>
                    {!hasChildren ? (
                      <Link
                        href={item.href ?? "#"}
                        className={cn(
                          "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                          "bg-transparent text-muted-foreground hover:bg-forest/10 hover:text-forest",
                          isActive && "bg-forest/10 text-forest",
                        )}
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <>
                        <NavigationMenuTrigger
                          className={cn(
                            "bg-transparent text-sm text-muted-foreground",
                            isActive && "bg-forest/10 text-forest",
                          )}
                        >
                          {item.href ? (
                            <Link href={item.href} className="inline-flex">
                              {item.title}
                            </Link>
                          ) : (
                            item.title
                          )}
                        </NavigationMenuTrigger>

                        <NavigationMenuContent>
                          <MegaMenu item={item} activePath={isMenuItemActive} />
                        </NavigationMenuContent>
                      </>
                    )}
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:justify-self-end">
            <ThemeSwitch />

            {!currentUser && (
              <Button
                href="/auth/sign-in"
                variant="link"
                className="hidden px-2 text-muted-foreground hover:text-primary hover:no-underline sm:inline-flex"
              >
                Patient Portal
              </Button>
            )}
            <Button className="hidden px-3 sm:px-4 md:inline-flex" href="/booking#book">
              <span>Book an Appointment</span>
            </Button>
            {currentUser && <AccountDropdown />}
          </div>
        </div>
      </header>

      <FloatingCtas>
        <Button size="lg" className="h-12 rounded-full px-5 shadow-lg" href="/booking#book">
          <CalendarDays className="size-4.5" />
          Book Appointment
        </Button>
      </FloatingCtas>
    </>
  );
};

export default Header;
