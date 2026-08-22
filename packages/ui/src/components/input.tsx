import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "./button";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const renderInput = () => (
    <input
      ref={ref}
      type={showPassword ? "text" : type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/60 selection:bg-primary selection:text-primary-foreground border-input bg-background w-full min-w-0 rounded-xl border px-4 py-3 text-sm transition-[color,background-color,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-accent focus-visible:bg-card",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );

  const EyeIcon = showPassword ? EyeClosed : Eye;

  return type !== "password" || props.name === "confirmPassword" ? (
    renderInput()
  ) : (
    <div className="relative">
      {renderInput()}{" "}
      <Button
        size="icon"
        variant="ghost"
        title={showPassword ? "Hide Password" : "Show Password"}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-transparent! text-muted-foreground"
        onClick={() => setShowPassword(!showPassword)}
      >
        <EyeIcon />
      </Button>
    </div>
  );
});
Input.displayName = "Input";

export { Input };
