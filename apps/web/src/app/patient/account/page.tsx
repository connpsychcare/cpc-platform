import UserAccountPage from "@workspace/ui/shared/UserAccountPage";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Account & Settings", "/patient/account");

const page = () => {
  return <UserAccountPage className="section" />;
};

export default page;
