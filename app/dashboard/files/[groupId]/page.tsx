import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import FileComponent from "@/app/dashboard/files/[groupId]/files-comp";
import { getFilesInGroup } from "@/lib/services/files";
import {getGroupMembers} from "@/lib/services/groups";
import {getAllUsers} from "@/lib/services/users";


export default async function FilesPage({ params }: { params: Promise<{groupId: string}> }) {
    const session = await getSession();

    if (!session) {
        return redirect("/auth/login");
    }

    const { groupId } = await params;

    if (!groupId) {
        return redirect("/dashboard/groups");
    }

    const files = await getFilesInGroup(groupId);
    const allUsers = await getAllUsers();
    const groupMembers = await getGroupMembers(groupId);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Files in Group</h1>
            <FileComponent
                files={files}
                groupId={groupId}
                ownerId={session.user.id}
                allUsers={allUsers}
                groupMembers={groupMembers}
            />
        </div>
    );
}
