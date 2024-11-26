"use client";

import {Folder, EllipsisVertical} from "lucide-react";
import React, {useEffect, useState} from "react";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {useViewMode} from "@/hooks/use-view-mode";
import {deleteGroupAction} from "@/actions/groups";
import {getMyGroups} from "@/lib/services/groups";
import {Group} from "@/lib/db/schema";
import {getSession} from "@/lib/auth";

export default async function GroupPage() {
    const groups = await
    const {viewMode} = useViewMode();
    const [folders, setFolders] = useState<Group[]>([]);


    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);

            try {
                const session = await getSession();
                if (!session) {
                    throw new Error("User not authenticated");
                }
                const userId = session.user.id;

                const groups = await getMyGroups(userId);
                setFolders(groups);
            } catch (err) {
                console.error("Error fetching groups:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleRemove = async (folderId: number) => {
        try {
            const response = await deleteGroupAction({groupId: folderId});
            if (response) {
                setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
            } else {
                throw new Error("Failed to delete the group.");
            }
        } catch (err) {
            console.error("Error deleting group:", err);
            alert("An error occurred while deleting the group.");
        }
    };

    if (loading) {
        return <div>Loading folders...</div>;
    }

    return (
        <>
            {viewMode === "grid" ? (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Folders</h2>
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    <Folder className="w-5 h-5"/>
                  </span>
                                    <span className="text-sm">{folder.name}</span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <EllipsisVertical className="w-4 h-4 cursor-pointer"/>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => console.log("Rename:", folder.id)}>
                                            Rename
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => console.log("Share:", folder.id)}>
                                            Share
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRemove(folder.id)}>
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
                        {folders.map((folder) => (
                            <tr key={folder.id} className="hover:bg-muted cursor-pointer">
                                <td className="py-2 px-4 flex items-center gap-2">
                                    <Folder className="w-4 h-4"/>
                                    {folder.name}
                                </td>
                                <td className="py-2 px-4">me</td>
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
