import { ShieldCheck } from "lucide-react";

export default function SafetyNote() {
  return (
    <div className="flex gap-3 rounded-2xl border border-accent/15 bg-accent/5 p-4 text-sm leading-6 text-muted-foreground">
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" />
      <p>
        <strong className="text-foreground">A note about urgent support:</strong> This site is
        not an emergency service. If you or someone you know may be in immediate danger, call
        or text 988 or call 911.
      </p>
    </div>
  );
}
