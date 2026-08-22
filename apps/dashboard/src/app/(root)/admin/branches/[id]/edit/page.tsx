import BranchForm from "@/components/forms/BranchForm";

const page = async ({ params }: PageProps<"/admin/branches/[id]/edit">) => {
  const { id } = await params;

  return <BranchForm formType="update" entityId={id} />;
};

export default page;
