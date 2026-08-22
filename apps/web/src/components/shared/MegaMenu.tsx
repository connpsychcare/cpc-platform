"use client";

import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { appIconMap } from "@workspace/ui/lib/icons";
import type { HeaderNavItem } from "@workspace/shared/constants";

type MegaMenuProps = {
  item: HeaderNavItem;
  activePath: (href: string) => boolean;
};

const MegaMenu = ({ item, activePath }: MegaMenuProps) => {
  if (!item.children) return null;
  return (
    <div className="grid w-190 grid-cols-3 gap-5 p-5">
      <div
        className={cn(
          "grid gap-3",
          item.featured ? "col-span-2 grid-cols-2" : "col-span-3 grid-cols-3",
        )}
      >
        {item.children.map((child) => {
          const Icon = child.icon ? appIconMap[child.icon] : null;

          return (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "group flex gap-3 rounded-2xl border border-transparent bg-background p-3 transition hover:border-primary/20 hover:bg-primary/10 active:border-primary/20 active:bg-primary/10",
                activePath(child.href) && "border-primary/20 bg-primary/10",
              )}
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary/20">
                {Icon ? <Icon className="size-5" /> : null}
              </div>

              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-sm font-semibold text-foreground transition group-hover:text-primary">
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

      {item.featured ? (
        <Link
          href={item.featured.href}
          className="group relative overflow-hidden rounded-3xl border border-border"
        >
          {item.featured.image ? (
            <Image
              src={item.featured.image}
              alt={item.featured.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105 group-active:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent" />
          <div className="relative flex h-full min-h-72 flex-col justify-end p-5 text-white">
            <span className="text-lg font-semibold leading-tight">
              {item.featured.title}
            </span>
            <span className="mt-2 text-sm leading-6 text-white/85">
              {item.featured.description}
            </span>
          </div>
        </Link>
      ) : null}
    </div>
  );
};

export default MegaMenu;
