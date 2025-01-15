"use client";

import { Folder, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { deleteGroupAction } from "@/actions/groups";
import { Group } from "@/lib/db/types";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useQueryState } from "nuqs";
import { useToast } from "@/hooks/use-toast";
import {useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";


type GroupsProps = {
  groups: Group[];
};

export default function GroupComponent({ groups }: GroupsProps) {
  const session = authClient.useSession();
  const { toast } = useToast();

  const [viewMode] = useQueryState("viewMode", {
    defaultValue: "grid",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);
  const router = useRouter();

  const { executeAsync } = useAction(deleteGroupAction);

  const handleDoubleClick = (group: Group) => {
    router.push(`/dashboard/files/${group.id}`);
  };

  const handleDeleteGroup = async () => {
    if (!deletingGroup) return;
    try {
      await executeAsync({ groupId: deletingGroup.id });
      router.refresh();
      toast({
        title: "Folder deleted successfully. 🎉",
        description: "Your operation was completed successfully.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Failed to delete Folder ❌",
        description: `Something went wrong. Please try again. ${err}`,
        variant: "destructive",
      });
    } finally {
      setDialogOpen(false);
      setDeletingGroup(null);
    }
  };

  const openDeleteDialog = (group: Group) => {
    setDeletingGroup(group);
    setDialogOpen(true);
  };


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
                onDoubleClick={() => handleDoubleClick(group)}
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
                        onClick={() => openDeleteDialog(group)}
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
              {groups.map((group) => (
                <tr key={group.id} onDoubleClick={() => handleDoubleClick(group)} className="hover:bg-muted cursor-pointer">
                  <td className="py-2 px-4 flex items-center gap-2">
                    <Folder className="w-4 h-4 flex-shrink-0" />
                    {group.name}
                  </td>
                  <td className="py-2 px-4">
                    {group.ownerId === session.data?.user.id
                      ? "me"
                      : group.ownerId}
                  </td>
                  <td className="py-2 px-4">-</td>
                  <td className="py-2 px-4">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this folder? This action cannot be undone.</p>
          <DialogFooter>
            <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={() => setDialogOpen(false)}
            >
              Cancel
            </button>
            <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={handleDeleteGroup}
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}
