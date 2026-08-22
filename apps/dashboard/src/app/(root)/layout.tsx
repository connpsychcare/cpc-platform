import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import DashboardLayout from "@workspace/ui/shared/DashboardLayout";

const Layout = ({ children }: LayoutProps<"/">) => {
  return (
    <DashboardLayout appType="dashboard" skeleton={<DashboardSkeleton />}>
      {children}
    </DashboardLayout>
  );
};

export default Layout;

