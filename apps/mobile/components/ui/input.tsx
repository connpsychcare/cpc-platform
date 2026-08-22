import { TextInput, View } from "react-native";
import { useState } from "react";
import type { ComponentProps } from "react";

import { AppIcon } from "@/components/ui/app-icon";
import { useThemeColor } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function Input({
  className,
  type,
  editable = true,
  secureTextEntry,
  style,
  placeholderTextColor,
  ...props
}: ComponentProps<typeof TextInput> & { className?: string; type?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const textColor = useThemeColor("foreground");
  const defaultPlaceholderColor = useThemeColor("muted", "foreground");

  return (
    <View
      className={cn(
        "min-h-11 w-full flex-row items-center rounded-2xl border border-input bg-transparent",
        !editable && "opacity-50",
        className,
      )}
    >
      <TextInput
        style={[
          {
            flex: 1,
            minHeight: 44,
            paddingHorizontal: 12,
            paddingVertical: 8,
            paddingRight: isPassword ? 48 : 12,
            fontFamily: "Inter_400Regular",
            fontSize: 12,
            color: textColor,
          },
          style,
        ]}
        placeholderTextColor={placeholderTextColor ?? defaultPlaceholderColor}
        underlineColorAndroid="transparent"
        secureTextEntry={isPassword ? !showPassword : secureTextEntry}
        editable={editable}
        {...props}
      />
      {isPassword ? (
        <Button
          size="icon"
          variant="ghost"
          accessibilityLabel="Show/Hide Password"
          className="absolute right-3 top-1.5"
          onPress={() => setShowPassword((current) => !current)}
        >
          <AppIcon
            name={showPassword ? "EyeOffIcon" : "EyeIcon"}
            size="md"
            variant="primary"
          />
        </Button>
      ) : null}
    </View>
  );
}
