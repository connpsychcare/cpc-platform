import CUUserForm from "@/components/forms/CUUserForm";

const page = async ({ params }: PageProps<"/admin/users/[id]/edit">) => {
  const { id } = await params;
  return <CUUserForm formType="update" entityId={id} />;
};

export default page;
