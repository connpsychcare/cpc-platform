import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { cn } from "@/lib/utils";

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const context = useContext(DropdownMenuContext);

  if (!context) {
    throw new Error("DropdownMenu components must be used within DropdownMenu.");
  }

  return context;
}

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return <DropdownMenuContext.Provider value={value}>{children}</DropdownMenuContext.Provider>;
}

export function DropdownMenuTrigger({ children }: { children: ReactNode }) {
  const { open, setOpen } = useDropdownMenuContext();

  return <Pressable onPress={() => setOpen(!open)}>{children}</Pressable>;
}

export function DropdownMenuContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useDropdownMenuContext();

  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent
      onRequestClose={() => setOpen(false)}
    >
      <Pressable className="flex-1 bg-dark-section/10" onPress={() => setOpen(false)}>
        <View className="flex-1">
          <Pressable
            className={cn(
              "absolute right-4 top-24 w-72 rounded-[28px] border border-border bg-popover p-2 shadow-soft",
              className,
            )}
            onPress={() => undefined}
          >
            {children}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

export function DropdownMenuLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <View className={cn("px-3 py-3", className)}>{children}</View>;
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <View className={cn("my-1 h-px bg-border", className)} />;
}

export function DropdownMenuItem({
  children,
  className,
  destructive = false,
  onSelect,
}: {
  children: ReactNode;
  className?: string;
  destructive?: boolean;
  onSelect?: () => void;
}) {
  const { setOpen } = useDropdownMenuContext();

  return (
    <Pressable
      className={cn(
        "flex-row items-center gap-3 rounded-[20px] px-3 py-3 active:bg-accent/60",
        className,
      )}
      onPress={() => {
        setOpen(false);
        onSelect?.();
      }}
    >
      {typeof children === "string" ? (
        <Text
          className={cn(
            "font-body-medium text-sm text-popover-foreground",
            destructive && "text-destructive",
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
