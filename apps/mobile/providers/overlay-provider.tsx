import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppIcon } from "@/components/ui/app-icon";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OverlayMode = "sheet" | "modal";

export type OverlayHeader = {
  title: string;
  description?: string;
};

export type OverlayOptions = {
  mode?: OverlayMode;
  content: ReactNode;
  header?: OverlayHeader;
};

type OverlayContextType = {
  openOverlay: (options: OverlayOptions) => void;
  closeOverlay: () => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

export const OverlayContext = createContext<OverlayContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function OverlayProvider({ children }: { children: ReactNode }) {
  const { height } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OverlayOptions | null>(null);

  const openOverlay = useCallback((opts: OverlayOptions) => {
    setOptions({ mode: "sheet", ...opts });
    setOpen(true);
  }, []);

  const closeOverlay = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ openOverlay, closeOverlay }),
    [openOverlay, closeOverlay],
  );

  const mode = options?.mode ?? "sheet";

  return (
    <OverlayContext.Provider value={value}>
      {children}

      {open && options && mode === "sheet" && (
        <Modal
          visible={open}
          animationType="slide"
          transparent
          statusBarTranslucent
          onRequestClose={closeOverlay}
        >
          <View style={styles.backdrop}>
            <Pressable
              style={StyleSheet.absoluteFillObject}
              className="bg-dark-section/40"
              onPress={closeOverlay}
            />

            <View
              style={{ maxHeight: height * 0.92 }}
              className="rounded-t-4xl border border-border bg-popover"
            >
              <SafeAreaView edges={["bottom"]}>
                {/* Drag handle */}
                <View className="items-center pb-1 pt-3">
                  <View className="h-1 w-10 rounded-full bg-border" />
                </View>

                {/* Header */}
                {options.header && (
                  <View className="flex-row items-start justify-between border-b border-border px-5 pb-4 pt-2">
                    <View className="flex-1 gap-1 pr-4">
                      <Text className="font-primary text-xl text-popover-foreground">
                        {options.header.title}
                      </Text>
                      {options.header.description && (
                        <Text className="font-secondary text-sm text-muted-foreground">
                          {options.header.description}
                        </Text>
                      )}
                    </View>
                    <Pressable onPress={closeOverlay} className="mt-0.5">
                      <AppIcon name="XIcon" size="sm" variant="muted" />
                    </Pressable>
                  </View>
                )}

                {/* Content */}
                <ScrollView
                  style={{ maxHeight: height * 0.75 }}
                  contentContainerStyle={{ padding: 20, paddingBottom: 8 }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {options.content}
                </ScrollView>
              </SafeAreaView>
            </View>
          </View>
        </Modal>
      )}

      {open && options && mode === "modal" && (
        <Modal
          visible={open}
          animationType="fade"
          transparent
          statusBarTranslucent
          onRequestClose={closeOverlay}
        >
          <View style={styles.modalBackdrop}>
            <Pressable
              style={StyleSheet.absoluteFillObject}
              className="bg-dark-section/60"
              onPress={closeOverlay}
            />

            <View
              style={{ maxHeight: height * 0.85, width: "92%" }}
              className="rounded-3xl border border-border bg-popover"
            >
              {/* Header */}
              <View className="flex-row items-start justify-between border-b border-border px-5 pb-4 pt-5">
                <View className="flex-1 gap-1 pr-4">
                  {options.header && (
                    <Text className="font-primary text-xl text-popover-foreground">
                      {options.header.title}
                    </Text>
                  )}
                  {options.header?.description && (
                    <Text className="font-secondary text-sm text-muted-foreground">
                      {options.header.description}
                    </Text>
                  )}
                </View>
                <Pressable onPress={closeOverlay}>
                  <AppIcon name="XIcon" size="sm" variant="muted" />
                </Pressable>
              </View>

              {/* Content */}
              <ScrollView
                style={{ maxHeight: height * 0.65 }}
                contentContainerStyle={{ padding: 20 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {options.content}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </OverlayContext.Provider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
