import { notFound } from "next/navigation";
import type { ValidateOtpType } from "@workspace/contracts/auth";
import type { AuthFormType } from "@workspace/contracts";
import { AuthForm } from "@workspace/ui/forms/AuthForm";
import { noIndexMetadata } from "@/lib/seo";

const AUTH_TITLES: Record<string, string> = {
  "sign-in": "Sign In",
  "sign-up": "Create an Account",
  "reset-password": "Reset Your Password",
  "set-password": "Set a New Password",
};

export async function generateMetadata({ params }: PageProps<"/auth/[type]">) {
  const { type } = await params;
  return noIndexMetadata(AUTH_TITLES[type] ?? "Account Access", `/auth/${type}`);
}

const page = async ({
  params,
  searchParams,
}: PageProps<"/auth/[type]">) => {
  const { type } = await params;
  const queryParams = (await searchParams) as ValidateOtpType;

  if (
    !["sign-in", "sign-up", "reset-password", "set-password"].includes(type)
  ) {
    return notFound();
  }
  const formType = type as AuthFormType;

  return (
    <AuthForm appType="web" formType={formType} queryParams={queryParams} />
  );
};

export default page;
