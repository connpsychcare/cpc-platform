import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground/60 focus-visible:border-accent focus-visible:bg-card aria-invalid:border-destructive aria-invalid:ring-destructive/20 bg-background flex field-sizing-content min-h-16 w-full resize-none rounded-xl border px-4 py-3 text-sm transition-[color,background-color,border-color] outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
