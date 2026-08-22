import { TextInput } from "react-native";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

export function Textarea({
  className,
  editable = true,
  multiline = true,
  textAlignVertical = "top",
  ...props
}: ComponentProps<typeof TextInput> & { className?: string }) {
  return (
    <Input
      multiline={multiline}
      textAlignVertical={textAlignVertical}
      editable={editable}
      className={cn("min-h-24 w-full items-start", !editable && "opacity-50", className)}
      {...props}
    />
  );
}
