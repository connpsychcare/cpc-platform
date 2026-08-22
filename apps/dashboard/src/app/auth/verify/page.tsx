
import VerifyAuthPage, {
  type VerifyAuthProps,
} from "@workspace/ui/shared/VerifyAuthPage";

const page = async ({ searchParams }: PageProps<"/auth/verify">) => {
  const query = (await searchParams) as unknown as VerifyAuthProps;

  return <VerifyAuthPage {...query} />;
};

export default page;
