"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createGroupAction } from "@/actions/groups";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface AddFolderPopoverProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export const AddFolderPopover: React.FC<AddFolderPopoverProps> = ({
  isOpen,
  onCloseAction,
}) => {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const { toast } = useToast();

  const { executeAsync, isPending, result } = useAction(createGroupAction);

  async function handleCreateGroup() {
    try {
      await executeAsync({ name: groupName });
      onCloseAction();
      router.refresh();

      toast({
        title: "Folder Created 🎉",
        description: "The folder has been created successfully.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Failed to Create Folder ❌",
        description: `Failed to create the folder. Please try again. ${err}`,
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={isPending}
          />
          {!result.data?.ok && (
            <p className="text-red-500 text-sm">{result.data?.message}</p>
          )}
          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={onCloseAction}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => handleCreateGroup()}
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
