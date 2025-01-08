import { getSession } from "@/lib/auth";
import { getMyGroups } from "@/lib/services/groups";
import { redirect } from "next/navigation";
import GroupComponent from "./groups-comp";

export default async function GroupsPage() {
  const session = await getSession();

  if (!session) {
    return redirect("/auth/login");
  }

  const groups = await getMyGroups(session.user.id);

  return <GroupComponent groups={groups} />;
}
