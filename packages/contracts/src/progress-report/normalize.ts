import type { ProgressReportContent } from "./types";

/**
 * A report's `content` is a JSON snapshot taken when it was generated, so an
 * older row can predate any change to the shape. Every reader goes through this
 * so a missing key degrades instead of throwing, and the fields from the
 * earlier shape carry over where they map cleanly.
 *
 * Shared by the server's PDF builder and the dashboard detail page, which both
 * crashed on seeded reports before this existed.
 */
export function normalizeProgressReportContent(
  raw: unknown,
): ProgressReportContent {
  const c = (raw ?? {}) as Record<string, any>;

  return {
    patient: {
      // Earlier snapshots stored the patient as `displayName`.
      name: c.patient?.name ?? c.patient?.displayName ?? "Unknown patient",
      dob: c.patient?.dob ?? null,
      diagnosis: c.patient?.diagnosis ?? null,
    },
    provider: c.provider
      ? {
          name: c.provider.name ?? c.provider.displayName ?? "Unknown",
          credentials: c.provider.credentials ?? [],
        }
      : null,
    treatmentPlan: c.treatmentPlan?.title
      ? { title: c.treatmentPlan.title }
      : null,
    // Earlier snapshots called this `programs`.
    behaviorPrograms: (c.behaviorPrograms ?? c.programs ?? []).map(
      (p: Record<string, any>) => ({
        name: p.name ?? "Untitled program",
        type: p.type ?? "",
        masteryPercent: p.masteryPercent ?? 0,
        sessionsCount: p.sessionsCount ?? p.sessions ?? 0,
        lastSessionDate: p.lastSessionDate ?? null,
        masteryStatus: p.masteryStatus ?? "inProgress",
      }),
    ),
    sessionStats: {
      total: c.sessionStats?.total ?? c.sessionSummary?.totalSessions ?? 0,
      totalMinutes:
        c.sessionStats?.totalMinutes ?? c.sessionSummary?.totalMinutes ?? 0,
      averageDurationMinutes: c.sessionStats?.averageDurationMinutes ?? 0,
      firstSession: c.sessionStats?.firstSession ?? null,
      lastSession: c.sessionStats?.lastSession ?? null,
    },
    dataPointSummary: {
      totalTrials: c.dataPointSummary?.totalTrials ?? 0,
      programsWithData: c.dataPointSummary?.programsWithData ?? 0,
    },
    generatedAt: c.generatedAt ?? new Date().toISOString(),
  };
}
