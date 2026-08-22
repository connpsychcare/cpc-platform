import TeacherAssessmentClient from "./page-client";

export const metadata = {
  title: "Teacher Assessment Form",
  description:
    "Complete the Vanderbilt Assessment Scale for the student in your class. Your responses help the treating clinician provide the best care.",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function TeacherAssessmentPage({ params }: Props) {
  const { token } = await params;
  return <TeacherAssessmentClient token={token} />;
}
