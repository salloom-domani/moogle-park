"use client";

import {useState} from "react";
import { Change, diffWords} from "diff";
import {FileText, EllipsisVertical} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {
    checkInFileAction,
    checkOutFileAction,
    deleteFileAction,
    getFileByIdAction, renameFileAction,
    updateFileAction
} from "@/actions/files";
import {AddFilePopover} from "@/components/add-new-file-popup";
import {InviteUsersPopover} from "@/components/invite-users-to-group-popup";
import {useAction} from "next-safe-action/hooks";
import {useToast} from "@/hooks/use-toast";
import {useQueryState} from "nuqs";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";
import {FileState} from "@prisma/client";

type FileComponentProps = {
    files: FileType[];
    groupId: string;
    ownerId: string;
    allUsers: User[];
    groupMembers: User[];
};

interface FileType {
    id: string;
    name: string;
    ownerId: string;
    groupId: string;
    state: string;
    content?: string;
    updatedAt: Date;
    createdAt: Date;
    deletedAt: Date | null;
    currentVersionId: number | null;
}

interface User {
    id: string;
    email: string;
    name: string;
}


type FileResponseType = FileType | { content: string };


export default function FileComponent({
                                          files,
                                          groupId,
                                          ownerId,
                                          allUsers,
                                          groupMembers,
                                      }: FileComponentProps) {
    const {toast} = useToast();
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deletingFile, setDeletingFile] = useState<FileType | null>(null);
    const [viewMode] = useQueryState("viewMode", {defaultValue: "grid"});
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [editingFile, setEditingFile] = useState<FileType | null>(null);
    const [originalContent, setOriginalContent] = useState("");
    const [updatedContent, setUpdatedContent] = useState("");
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [renamingFile, setRenamingFile] = useState<FileType | null>(null);
    const [newFileName, setNewFileName] = useState("");
    const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
    const [firstVersion, setFirstVersion] = useState<string | null>(null);
    const [lastVersion, setLastVersion] = useState<string | null>(null);
    // const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
    const [diffChanges, setDiffChanges] = useState<Change[]>([]);


    const {executeAsync: deleteFile} = useAction(deleteFileAction);
    const {executeAsync: checkOutFile} = useAction(checkOutFileAction);
    const {executeAsync: checkInFile} = useAction(checkInFileAction);
    const {executeAsync: updateFile} = useAction(updateFileAction);
    const {executeAsync: getFileById} = useAction(getFileByIdAction);

    const handleDoubleClick = async (file: FileType) => {
        try {
            if(file.state == FileState.USED) {
                toast({
                    title: "Failed to Open File ❌",
                    description: `File in used Please try again later`,
                    variant: "destructive",
                });
                return;
            }
            await checkInFile({fileId: file.id, userId: ownerId});

            const response = await getFileById({fileId: file.id});

            if (response && response.data) {
                const fetchedFile = response.data.data as FileResponseType;

                if ('id' in fetchedFile) {
                    setEditingFile(fetchedFile);
                    setOriginalContent(fetchedFile.content || "");
                    setUpdatedContent(fetchedFile.content || "");
                } else {
                    throw new Error("Invalid response from getFileById");
                }
            }
        } catch (err) {
            toast({
                title: "Failed to Check In File ❌",
                description: `Could not check In into the file. Please try again. ${err}`,
                variant: "destructive",
            });
        }
    };
    const handleSave = async () => {
        if (!editingFile) return;

        if (originalContent !== updatedContent) {
            try {
                await updateFile({
                    fileId: editingFile.id,
                    fileContent: updatedContent,
                    userId: ownerId,
                });
                toast({
                    title: "File Updated 🎉",
                    description: "The file content has been updated and a new version created.",
                    variant: "success",
                });
                router.refresh();

            } catch (err) {
                toast({
                    title: "Failed to Update File ❌",
                    description: `Could not update the file. Please try again. ${err}`,
                    variant: "destructive",
                });
                return;
            }
        }
        try {
            await checkOutFile({fileId: editingFile.id, userId: ownerId});
            toast({
                title: "File Checked Out ✅",
                description: "The file is now available for others to edit.",
                variant: "success",
            });
        } catch (err) {
            toast({
                title: "Failed to Check In File ❌",
                description: `Could not check in the file. Please try again. ${err}`,
                variant: "destructive",
            });
        } finally {
            setEditingFile(null);
        }
    };
    const handleCancel = async () => {
        if (editingFile) {
            try {
                await checkOutFile({fileId: editingFile.id, userId: ownerId});
            } catch (err) {
                toast({
                    title: "Failed to Check Out File ❌",
                    description: `Could not check Out on file. Please try again. ${err}`,
                    variant: "destructive",
                });
                router.refresh();
            } finally {
                setEditingFile(null);
            }
        }
    };
    const handleDeleteFile = async () => {
        if (!deletingFile) return;
        try {
            await deleteFile({fileId: deletingFile.id, userId: deletingFile.ownerId});
            router.refresh();
            toast({
                title: "File deleted successfully. 🎉",
                description: "Your operation was completed successfully.",
                variant: "success",
            });
        } catch (err) {
            toast({
                title: "Failed to delete file ❌",
                description: `Something went wrong. Please try again. ${err}`,
                variant: "destructive",
            });
        } finally {
            setDialogOpen(false);
            setDeletingFile(null);
        }
    };
    const openDeleteDialog = (file: FileType) => {
        setDeletingFile(file);
        setDialogOpen(true);
    };
    const handleCompareVersions = async (file: FileType) => {
        try {
            // Fetch the first and last versions
            const firstVersionResponse = await getFileById({
                fileId: file.id,
                version: "first",
            });
            const lastVersionResponse = await getFileById({
                fileId: file.id,
                version: "last",
            });

            const firstContent = firstVersionResponse?.data?.data.content || "";
            const lastContent = lastVersionResponse?.data?.data.content || "";

            setFirstVersion(firstContent);
            setLastVersion(lastContent);

            const changes = diffWords(firstContent, lastContent);
            setDiffChanges(changes);
            setComparisonDialogOpen(true);
        } catch (error) {
            toast({
                title: "Comparison failed",
                description: `Could not fetch file versions for comparison. ${error}`,
                variant: "destructive",
            });
        }
    };

    return (
        <>
            {files.length === 0 ? (
                <div className="flex items-center justify-center gap-5">
                    <Button
                        variant="default"
                        onClick={() => setUploadDialogOpen(true)}
                        className="text-lg px-6 py-3"
                    >
                        Upload New File
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => setInviteDialogOpen(true)}
                        className="text-lg px-6 py-3"

                    >
                        Invite Users to group
                    </Button>
                </div>
            ) : (
                <div>
                    <div className="flex justify-end items-center mb-4 gap-5">

                        <Button variant="default" onClick={() => setUploadDialogOpen(true)}>
                            Upload New File
                        </Button>
                        <Button variant="default" onClick={() => setInviteDialogOpen(true)}>
                            Invite Users to group
                        </Button>
                    </div>
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {files.map((file) => (
                                <div
                                    key={file.id}
                                    onDoubleClick={() => handleDoubleClick(file)}
                                    className={cn(
                                        "flex items-center justify-between rounded-lg border p-4 hover:bg-muted cursor-pointer",
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-muted-foreground"/>
                                        <span className="text-sm">{file.name}</span>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <EllipsisVertical className="w-4 h-4 cursor-pointer"/>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => {
                                                setRenamingFile(file);
                                                setNewFileName(file.name);
                                            }}>
                                                Rename
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleCompareVersions(file)}>
                                                Compare Versions
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => openDeleteDialog(file)}>
                                                Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <table className="table-auto w-full text-left">
                            <thead className="border-b">
                            <tr>
                                <th className="py-2 px-4">Name</th>
                                <th className="py-2 px-4">Owner</th>
                                <th className="py-2 px-4">Last Modified</th>
                                <th className="py-2 px-4">State</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {files.map((file) => (
                                <tr key={file.id} onDoubleClick={() => handleDoubleClick(file)}
                                    className="hover:bg-muted cursor-pointer">
                                    <td className="py-2 px-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4 flex-shrink-0"/>
                                        {file.name}
                                    </td>
                                    <td className="py-2 px-4">{file.ownerId || "Unknown"}</td>
                                    <td className="py-2 px-4">
                                        {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="py-2 px-4">{file.state || "-"}</td>
                                    <td className="py-2 px-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <EllipsisVertical className="w-4 h-4 cursor-pointer"/>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => {
                                                    setRenamingFile(file);
                                                    setNewFileName(file.name);
                                                }}>
                                                    Rename
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleCompareVersions(file)}>
                                                    Compare Versions
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openDeleteDialog(file)}>
                                                    Remove
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {editingFile && (
                <Dialog open={!!editingFile} onOpenChange={handleCancel}>
                    <DialogContent className="max-w-md lg:max-w-4xl mx-auto">
                        <DialogHeader>
                            <DialogTitle>Editing File: {editingFile.name}</DialogTitle>
                        </DialogHeader>
                        <textarea
                            value={updatedContent}
                            onChange={(e) => setUpdatedContent(e.target.value)}
                            className="w-full p-2 border rounded-md h-80"
                        />
                        <DialogFooter>
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button variant="default" onClick={handleSave}>
                                Save
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this file? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteFile}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!renamingFile} onOpenChange={() => setRenamingFile(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename File</DialogTitle>
                    </DialogHeader>
                    <Input
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter new file name"
                    />
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setRenamingFile(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={async () => {
                                if (renamingFile) {
                                    try {
                                        await renameFileAction({
                                            fileId: renamingFile.id,
                                            newName: newFileName,
                                            userId: ownerId,
                                        });

                                        toast({
                                            title: "File renamed",
                                            description: `The file has been successfully renamed to ${newFileName}.`,
                                            variant: "success",
                                        });
                                        setRenamingFile(null);
                                        router.refresh();
                                    } catch (err) {
                                        const error = err as Error;
                                        console.error("Error message:", error.message);
                                        toast({
                                            title: "Failed to rename file",
                                            description: `An error occurred`,
                                            variant: "destructive",
                                        });
                                    }
                                }
                            }}
                        >
                            Rename
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {comparisonDialogOpen && (
                <Dialog open={comparisonDialogOpen} onOpenChange={() => setComparisonDialogOpen(false)}>
                    <DialogContent className="max-w-md lg:max-w-6xl mx-auto" style={{ maxHeight: "90vh", overflowY: "auto" }}>
                        <DialogHeader>
                            <DialogTitle>Compare Versions</DialogTitle>
                        </DialogHeader>
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <div style={{ flex: 1, minHeight: "300px" }}>
                                <h4>First Version</h4>
                                <textarea
                                    value={firstVersion || ""}
                                    readOnly
                                    style={{ width: "100%", height: "100%", resize: "none", overflowY: "auto" }}
                                />
                            </div>
                            <div style={{ flex: 1, minHeight: "300px" }}>
                                <h4>Last Version</h4>
                                <textarea
                                    value={lastVersion || ""}
                                    readOnly
                                    style={{ width: "100%", height: "100%", resize: "none", overflowY: "auto" }}
                                />
                            </div>
                        </div>
                        <div className="pt-5">
                            <h4>Changes:</h4>
                            <div
                                style={{
                                    whiteSpace: "pre-wrap",
                                    fontFamily: "monospace",
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                    border: "1px solid #ccc",
                                    padding: "1rem",
                                    borderRadius: "4px",
                                }}
                            >
                                {diffChanges.length === 0 ? (
                                    <p>There are no changes between the two versions.</p>
                                ) : (
                                    diffChanges.map((change, idx) =>
                                            change.added || change.removed ? (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        background: change.added ? "#e6ffed" : "#ffeef0",
                                                        textDecoration: change.removed ? "line-through" : "none",
                                                    }}
                                                >
                  {change.value}
                </span>
                                            ) : null
                                    )
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="secondary" onClick={() => setComparisonDialogOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}



            <AddFilePopover
                isOpen={uploadDialogOpen}
                onCloseAction={() => setUploadDialogOpen(false)}
                groupId={groupId}
                ownerId={ownerId}
            />

            <InviteUsersPopover
                isOpen={inviteDialogOpen}
                onClose={() => setInviteDialogOpen(false)}
                groupId={groupId}
                allUsers={allUsers}
                groupMembers={groupMembers}
            />
        </>
    );
}
