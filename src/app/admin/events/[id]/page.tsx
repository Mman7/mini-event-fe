import { AdminEventEdit } from "@/src/components/admin/AdminEventEdit";

export const instant = false;

export default async function EditAdminEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminEventEdit id={id} />;
}
