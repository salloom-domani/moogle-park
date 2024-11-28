"use client";

import { Folder, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useViewMode } from "@/hooks/use-view-mode";
import { deleteGroupAction } from "@/actions/groups";
import { Group } from "@/lib/db/types";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

type GroupsProps = {
  groups: Group[];
};

export default function GroupComponent({ groups }: GroupsProps) {
  const session = authClient.useSession();
  const { viewMode } = useViewMode();
  const router = useRouter();

  const { executeAsync } = useAction(deleteGroupAction);

  async function handleDeleteGroup(groupId: string) {
    try {
      await executeAsync({ groupId });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {viewMode === "grid" ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">Folders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {groups.map((group) => (
              <div
                key={group.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-4 hover:bg-muted cursor-pointer",
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    <Folder className="w-5 h-5" />
                  </span>
                  <span className="text-sm">{group.name}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <EllipsisVertical className="w-4 h-4 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => console.log("Rename:", group.id)}
                    >
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => console.log("Share:", group.id)}
                    >
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteGroup(group.id)}
                    >
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <table className="table-auto w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Owner</th>
                <th className="py-2 px-4">Last Modified</th>
                <th className="py-2 px-4">File Size</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((folder) => (
                <tr key={folder.id} className="hover:bg-muted cursor-pointer">
                  <td className="py-2 px-4 flex items-center gap-2">
                    <Folder className="w-4 h-4 flex-shrink-0" />
                    {folder.name}
                  </td>
                  <td className="py-2 px-4">
                    {folder.ownerId === session.data?.user.id
                      ? "me"
                      : folder.ownerId}
                  </td>
                  <td className="py-2 px-4">-</td>
                  <td className="py-2 px-4">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
