import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  View,
  type LayoutRectangle,
} from "react-native";

import { cn } from "@/lib/utils";

type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<View | null>;
  triggerLayout: LayoutRectangle | null;
  setTriggerLayout: (layout: LayoutRectangle | null) => void;
};

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const context = useContext(PopoverContext);

  if (!context) {
    throw new Error("Popover components must be used within Popover.");
  }

  return context;
}

export function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(
    null,
  );
  const triggerRef = useRef<View | null>(null);

  const open = controlledOpen ?? internalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (typeof controlledOpen === "undefined") {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  const contextValue = useMemo(
    () => ({
      open,
      setOpen,
      triggerRef,
      triggerLayout,
      setTriggerLayout,
    }),
    [open, triggerLayout],
  );

  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({
  children,
}: {
  children: ReactNode;
}) {
  const { setOpen, triggerRef, setTriggerLayout } = usePopoverContext();

  const measureTrigger = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
      setOpen(true);
    });
  };

  return (
    <View ref={triggerRef} collapsable={false}>
      {Children.map(children, (child) => {
        if (!isValidElement(child)) {
          return child;
        }

        const element = child as React.ReactElement<{
          onPress?: (...args: unknown[]) => void;
        }>;

        return cloneElement(element, {
          onPress: (...args: unknown[]) => {
            element.props?.onPress?.(...args);
            measureTrigger();
          },
        });
      })}
    </View>
  );
}

export function PopoverContent({
  children,
  className,
  width = 176,
  align = "start",
}: {
  children: ReactNode;
  className?: string;
  width?: number;
  align?: "start" | "center" | "end";
}) {
  const { open, setOpen, triggerLayout } = usePopoverContext();

  if (!open || !triggerLayout) {
    return null;
  }

  const screen = Dimensions.get("window");
  const safeMargin = 12;

  let left = triggerLayout.x;

  if (align === "center") {
    left = triggerLayout.x + triggerLayout.width / 2 - width / 2;
  }

  if (align === "end") {
    left = triggerLayout.x + triggerLayout.width - width;
  }

  left = Math.max(safeMargin, Math.min(left, screen.width - width - safeMargin));
  const top = Math.min(
    triggerLayout.y + triggerLayout.height + 8,
    screen.height - 220,
  );

  return (
    <Modal
      visible={open}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        className="flex-1 bg-transparent"
        onPress={() => setOpen(false)}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className={cn(
            "absolute rounded-2xl border border-border bg-popover p-2 shadow-soft",
            className,
          )}
          style={{ top, left, width }}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
