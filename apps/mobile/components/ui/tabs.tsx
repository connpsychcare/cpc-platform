import { Pressable, Text, View } from "react-native";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs components must be used within <Tabs />");
  }

  return context;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const currentValue = value ?? internalValue;

  const contextValue = useMemo(
    () => ({
      value: currentValue,
      setValue: (nextValue: string) => {
        if (typeof value === "undefined") {
          setInternalValue(nextValue);
        }
        onValueChange?.(nextValue);
      },
    }),
    [currentValue, onValueChange, value],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <View className={cn("gap-2", className)}>{children}</View>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <View
      className={cn(
        "flex-row rounded-2xl bg-muted p-1",
        className,
      )}
    >
      {Children.map(children, (child) =>
        isValidElement(child) ? cloneElement(child) : child,
      )}
    </View>
  );
}

export function TabsTrigger({
  className,
  value,
  children,
}: {
  className?: string;
  value: string;
  children: ReactNode;
}) {
  const context = useTabsContext();
  const isActive = context.value === value;

  return (
    <Pressable
      onPress={() => context.setValue(value)}
      className={cn(
        "flex-1 items-center justify-center rounded-lg border px-3 py-2",
        isActive
          ? "border-border bg-background"
          : "border-transparent bg-transparent",
        className,
      )}
    >
      {typeof children === "string" ? (
        <Text
          className={cn(
            "font-body-medium text-sm",
            isActive ? "text-foreground" : "text-muted-foreground",
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

export function TabsContent({
  className,
  value,
  children,
}: {
  className?: string;
  value: string;
  children: ReactNode;
}) {
  const context = useTabsContext();

  if (context.value !== value) {
    return null;
  }

  return <View className={cn("flex-1", className)}>{children}</View>;
}
