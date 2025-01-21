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
import { addFileAction } from "@/actions/files";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";

interface AddFilePopoverProps {
    isOpen: boolean;
    onCloseAction: () => void;
    groupId: string;
    ownerId: string;
}

export const AddFilePopover: React.FC<AddFilePopoverProps> = ({
                                                                  isOpen,
                                                                  onCloseAction,
                                                                  groupId,
                                                                  ownerId,
                                                              }) => {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const { toast } = useToast();

    const { executeAsync, isPending, result } = useAction(addFileAction);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    async function handleCreateFile() {
        if (!file) {
            toast({
                title: "No File Uploaded ❌",
                description: "Please upload a file before creating.",
                variant: "destructive",
            });
            return;
        }

        try {
            const fileContent = await file.text();
            await executeAsync({
                fileName: file.name,
                fileContent,
                groupId,
                ownerId,
            });
            onCloseAction();
            router.refresh();

            toast({
                title: "File Created 🎉",
                description: "The file has been created successfully.",
                variant: "success",
            });
        } catch (err) {
            toast({
                title: "Failed to Create File ❌",
                description: `Failed to create the file. Please try again. ${err}`,
                variant: "destructive",
            });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                    <DialogTitle>Create New File</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
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
                            onClick={() => handleCreateFile()}
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
