import React from "react";
import { Text, Section, Button } from "@react-email/components";
import { render } from "@react-email/render";

import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { emailTheme } from "./components/theme";

export interface TeacherAssessmentEmailProps {
  teacherName?: string;
  studentName: string;
  schoolName?: string;
  assessmentUrl: string;
  expiresAt: Date;
}

export const TeacherAssessment = ({
  teacherName,
  studentName,
  schoolName,
  assessmentUrl,
  expiresAt,
}: TeacherAssessmentEmailProps) => {
  const greeting = teacherName ? `Dear ${teacherName}` : "Dear Teacher";
  const school = schoolName ? ` at ${schoolName}` : "";
  const expiryLabel = expiresAt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Layout previewText={`Vanderbilt Assessment Request - ${studentName}`}>
      <Header
        title={greeting}
        subtitle="Vanderbilt ADHD Diagnostic Teacher Rating Scale"
      />

      <Text
        className="text-[15px] leading-relaxed"
        style={{ color: emailTheme.foreground }}
      >
        A clinician at Connected Psychiatric Care has requested that you complete
        a brief{" "}
        <strong>Vanderbilt ADHD Diagnostic Teacher Rating Scale</strong> for
        your student <strong>{studentName}</strong>
        {school}.
      </Text>

      <Text
        className="text-[15px] leading-relaxed"
        style={{ color: emailTheme.foreground }}
      >
        This rating scale helps our clinical team better understand{" "}
        {studentName}&rsquo;s attention and behavior in a school setting. It
        takes approximately 5–10 minutes to complete.
      </Text>

      <Section
        className="my-4 rounded-xl px-5 py-4"
        style={{ backgroundColor: emailTheme.codeBg }}
      >
        <Text
          className="m-0 text-[13px] leading-6"
          style={{ color: emailTheme.mutedForeground }}
        >
          This link expires on{" "}
          <strong style={{ color: emailTheme.foreground }}>{expiryLabel}</strong>
          .
        </Text>
      </Section>

      <Section className="mt-6 text-center">
        <Button
          href={assessmentUrl}
          style={{
            display: "inline-block",
            padding: "12px 28px",
            backgroundColor: emailTheme.primary,
            color: emailTheme.primaryForeground,
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          Complete Rating Scale
        </Button>
      </Section>

      <Text
        className="mt-6 text-[12px] leading-5"
        style={{ color: emailTheme.mutedForeground }}
      >
        If you did not expect this request or have questions, please contact the
        clinic directly. Do not share this link with others.
      </Text>
    </Layout>
  );
};

export const renderTeacherAssessmentEmail = (
  props: TeacherAssessmentEmailProps,
): Promise<string> =>
  render(React.createElement(TeacherAssessment, props));
