"use client";

import React, { createContext, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { cn } from "../lib/utils";

/* ========== Types ========== */
export type OverlayMode = "dialog" | "sheet" | "drawer";

type OverlayHeader = {
  title: string;
  description?: string;
  className?: string;
};

type OverlayFooter = {
  className?: string;
  children: React.ReactNode;
};

export type OverlayOptions = {
  mode?: OverlayMode;
  content: React.ReactNode;
  header?: OverlayHeader;
  footer?: OverlayFooter;
  className?: string;

  /**
   * sheet specific
   */
  side?: "top" | "right" | "bottom" | "left";

  /**
   * drawer specific
   */
  direction?: "top" | "right" | "bottom" | "left";
};

type OverlayContextType = {
  openOverlay: (options: OverlayOptions) => void;
  closeOverlay: () => void;
};

/* ========== Context ========== */
export const OverlayContext = createContext<OverlayContextType | null>(null);

/* ========== Shared Sections ========== */
function OverlayHeaderBlock({
  mode,
  header,
}: {
  mode: OverlayMode;
  header?: OverlayHeader;
}) {
  if (!header) return null;

  const headerClassName = cn(
    "shrink-0",
    header.className ? `text-xl border-b pb-5 ${header.className}` : "sr-only",
  );

  if (mode === "dialog") {
    return (
      <DialogHeader className={headerClassName}>
        <DialogTitle>{header.title}</DialogTitle>
        {header.description && (
          <DialogDescription>{header.description}</DialogDescription>
        )}
      </DialogHeader>
    );
  }

  if (mode === "sheet") {
    return (
      <SheetHeader className={headerClassName}>
        <SheetTitle>{header.title}</SheetTitle>
        {header.description && (
          <SheetDescription>{header.description}</SheetDescription>
        )}
      </SheetHeader>
    );
  }

  return (
    <DrawerHeader className={headerClassName}>
      <DrawerTitle>{header.title}</DrawerTitle>
      {header.description && (
        <DrawerDescription>{header.description}</DrawerDescription>
      )}
    </DrawerHeader>
  );
}

function OverlayFooterBlock({
  mode,
  footer,
}: {
  mode: OverlayMode;
  footer?: OverlayFooter;
}) {
  if (!footer) return null;

  const className = cn("shrink-0", footer.className);

  if (mode === "dialog") {
    return <DialogFooter className={className}>{footer.children}</DialogFooter>;
  }

  if (mode === "sheet") {
    return <SheetFooter className={className}>{footer.children}</SheetFooter>;
  }

  return <DrawerFooter className={className}>{footer.children}</DrawerFooter>;
}

/* ========== Provider ========== */
export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OverlayOptions | null>(null);

  const openOverlay = (opts: OverlayOptions) => {
    setOptions({
      mode: "dialog",
      ...opts,
    });
    setOpen(true);
  };

  const closeOverlay = () => {
    setOpen(false);
  };

  const value = useMemo(
    () => ({
      openOverlay,
      closeOverlay,
    }),
    [],
  );

  const mode = options?.mode ?? "dialog";

  const body = options ? (
    <div className="flex min-h-0 flex-1 flex-col">
      <OverlayHeaderBlock mode={mode} header={options.header} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="px-4 py-4 sm:px-6">{options.content}</div>
      </div>

      <OverlayFooterBlock mode={mode} footer={options.footer} />
    </div>
  ) : null;

  return (
    <OverlayContext.Provider value={value}>
      {children}

      {mode === "dialog" && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className={cn(
              "max-h-[98vh] overflow-y-auto scrollbar-hidden",
              options?.className,
            )}
          >
            {body}
          </DialogContent>
        </Dialog>
      )}

      {mode === "sheet" && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side={options?.side ?? "right"}
            className={cn("w-full sm:max-w-xl", options?.className)}
          >
            {body}
          </SheetContent>
        </Sheet>
      )}

      {mode === "drawer" && (
        <Drawer
          open={open}
          onOpenChange={setOpen}
          direction={options?.direction ?? "bottom"}
        >
          <DrawerContent
            className={cn(
              "max-h-[90vh] overflow-hidden rounded-none!",
              options?.className,
            )}
          >
            {body}
          </DrawerContent>
        </Drawer>
      )}
    </OverlayContext.Provider>
  );
}
