"use client";

import React, {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {createGroupAction} from "@/actions/groups";

interface AddFolderPopoverProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

export const AddFolderPopover: React.FC<AddFolderPopoverProps> = ({isOpen, onCloseAction}) => {
    const [folderName, setFolderName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddFolder = async () => {
        if (!folderName.trim()) {
            setError("Folder name cannot be empty.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await createGroupAction({name: folderName});
            console.log("Response:", response);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        type="text"
                        placeholder="Folder Name"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        disabled={loading}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end space-x-4">
                        <Button variant="secondary" onClick={onCloseAction} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant="default" onClick={handleAddFolder} disabled={loading}>
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
