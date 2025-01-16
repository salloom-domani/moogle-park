"use client";

import { Folder, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {deleteGroupAction, renameGroupAction} from "@/actions/groups";
import { Group } from "@/lib/db/types";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useQueryState } from "nuqs";
import { useToast } from "@/hooks/use-toast";
import {useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";


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
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [groupToRename, setGroupToRename] = useState<Group | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
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

  const handleRenameGroup = async () => {
    if (!groupToRename) return;

    try {
      await renameGroupAction({
        groupId: groupToRename.id,
        newName: newGroupName,
        userId: session.data?.user.id || "defaultUserId",
      });

      toast({
        title: "Group renamed successfully. 🎉",
        description: `Group renamed successfully new name group: ${newGroupName}`,
        variant: "success",
      });

      setRenameDialogOpen(false);
      setGroupToRename(null);
      router.refresh();
    } catch (err) {
      toast({
        title: "Failed to rename Folder ❌",
        description: `Something went wrong. Please try again. ${err}`,
        variant: "destructive",
      });
    }
  };

  const openRenameDialog = (group: Group) => {
    setGroupToRename(group);
    setNewGroupName(group.name);
    setRenameDialogOpen(true);
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
                    <DropdownMenuItem onClick={() => openRenameDialog(group)}>
                      Rename
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
              <th className="py-2 px-4">Actions</th>
              <th className="py-2 px-4">Last Modified</th>

            </tr>
            </thead>
            <tbody>
            {groups.map((group) => (
                  <tr key={group.id} onDoubleClick={() => handleDoubleClick(group)}
                      className="hover:bg-muted cursor-pointer">
                    <td className="py-2 px-4 flex items-center gap-2">
                      <Folder className="w-4 h-4 flex-shrink-0"/>
                      {group.name}
                    </td>
                    <td className="py-2 px-4">
                      {group.ownerId === session.data?.user.id
                          ? "me"
                          : group.ownerId}
                    </td>
                    <td className="py-2 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <EllipsisVertical className="w-4 h-4 cursor-pointer"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openRenameDialog(group)}>
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(group)}>
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
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
            <Button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={handleDeleteGroup}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={renameDialogOpen} onOpenChange={() => setRenameDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
          </DialogHeader>
          <Input
              type="text"
              className="w-full p-2 border rounded-md"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter new group name"
          />
          <DialogFooter>
            <Button
                variant="secondary"
                onClick={() => setRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
                variant="default"
                onClick={handleRenameGroup}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </>
  );
}
