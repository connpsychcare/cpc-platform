import { Badge } from "@workspace/ui/components/badge";
import StatCard from "@workspace/ui/shared/StatCard";

interface MetricCardProps {
  label: string;
  value: string | number;
  helper: string;
  tone?: "default" | "success" | "warning";
}

const toneClassMap = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
} satisfies Record<NonNullable<MetricCardProps["tone"]>, string>;

const MetricCard = ({
  label,
  value,
  helper,
  tone = "default",
}: MetricCardProps) => {
  return (
    <StatCard
      label={label}
      value={value}
      helper={helper}
      className="border-border/60 shadow-sm"
      action={
        <Badge variant="secondary" className={toneClassMap[tone]}>
          Live
        </Badge>
      }
    />
  );
};

export default MetricCard;
