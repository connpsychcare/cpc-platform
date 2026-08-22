
import VerifyAuthPage, {
  type VerifyAuthProps,
} from "@workspace/ui/shared/VerifyAuthPage";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Verify Your Account", "/auth/verify");

const page = async ({ searchParams }: PageProps<"/auth/verify">) => {
  const query = (await searchParams) as unknown as VerifyAuthProps;

  return <VerifyAuthPage {...query} />;
};

export default page;
