import { getSession } from "@/lib/auth";
import { getMyDeletedFiles } from "@/lib/services/files";
import { redirect } from "next/navigation";
import DeletedFilesComponent from "./trash-comp";

export default async function TrashPage() {
  const session = await getSession();

  if (!session) {
    return redirect("/auth/login");
  }

  const deletedFiles = await getMyDeletedFiles(session.user.id);

  return <DeletedFilesComponent deletedFiles={deletedFiles} />;
}
