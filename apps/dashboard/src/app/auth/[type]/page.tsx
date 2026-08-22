import { notFound } from "next/navigation";
import type { ValidateOtpType } from "@workspace/contracts/auth";
import type { AuthFormType } from "@workspace/contracts";
import { AuthForm } from "@workspace/ui/forms/AuthForm";

const page = async ({
  params,
  searchParams,
}: PageProps<"/auth/[type]">) => {
  const { type } = await params;
  const queryParams = (await searchParams) as ValidateOtpType;

  if (!["sign-in", "reset-password", "set-password"].includes(type)) {
    return notFound();
  }
  const formType = type as AuthFormType;
  return (
    <AuthForm
      appType="dashboard"
      formType={formType}
      queryParams={queryParams}
    />
  );
};

export default page;
