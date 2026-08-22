"use client";

import { publicHomeStats } from "@workspace/shared/constants";
import { usePublicStats } from "@/hooks/content";
import { StaggerContainer, StaggerItem } from "@/components/shared/animations";

export default function StatsSection() {
  const { data } = usePublicStats();

  const stats = data
    ? [
        { value: `${data.patientsServed}+`, label: publicHomeStats[0].label },
        { value: `${data.staffCount}+`, label: publicHomeStats[1].label },
        { value: `${data.yearsInOperation}+`, label: publicHomeStats[2].label },
        { value: `${data.satisfactionRate}%`, label: publicHomeStats[3].label },
      ]
    : publicHomeStats.map((s) => ({ value: s.value, label: s.label }));

  return (
    <section className="px-4 py-10 sm:px-6">
      <StaggerContainer className="section-container grid grid-cols-2 divide-x divide-y divide-border rounded-3xl border border-border bg-card shadow-(--soft-shadow) sm:grid-cols-4 sm:divide-y-0">
        {stats.map((stat) => (
          <StaggerItem key={stat.label} className="px-4 py-6 text-center sm:px-3">
            <p className="font-primary text-3xl font-extrabold tracking-tighter text-brand-ink">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.11em] text-muted-foreground">
              {stat.label}
            </p>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
