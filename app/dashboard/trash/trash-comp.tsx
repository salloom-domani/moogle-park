"use client";

import { FileText, EllipsisVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useQueryState } from "nuqs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type DeletedFilesProps = {
    deletedFiles: DeletedFileType[];
};

interface DeletedFileType {
    id: string;
    name: string;
    ownerId: string;
    groupId: string;
    deletedAt: Date | null;
    updatedAt: Date;
    createdAt: Date;
}

export default function DeletedFilesComponent({ deletedFiles }: DeletedFilesProps) {
    const { toast } = useToast();
    const [viewMode] = useQueryState("viewMode", {
        defaultValue: "grid",
    });

    const handleRestoreFile = (fileId: string) => {
        toast({
            title: "Restore functionality not implemented",
            description: `Restore the file with ID: ${fileId}`,
            variant: "warning",
        });
    };

    return (
        <div>
            {viewMode === "grid" ? (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Deleted Files</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {deletedFiles.map((deletedFile) => (
                            <div
                                key={deletedFile.id}
                                className={cn(
                                    "flex items-center justify-between rounded-lg border p-4 hover:bg-muted cursor-pointer",
                                )}
                            >
                                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    <FileText className="w-5 h-5" />
                  </span>
                                    <span className="text-sm">{deletedFile.name}</span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <EllipsisVertical className="w-4 h-4 cursor-pointer" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => handleRestoreFile(deletedFile.id)}
                                        >
                                            Restore
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
                            <th className="py-2 px-4">Deleted At</th>
                            <th className="py-2 px-4">Owner</th>
                        </tr>
                        </thead>
                        <tbody>
                        {deletedFiles.map((deletedFile) => (
                            <tr key={deletedFile.id} className="hover:bg-muted cursor-pointer">
                                <td className="py-2 px-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4 flex-shrink-0" />
                                    {deletedFile.name}
                                </td>
                                <td className="py-2 px-4">
                                    {deletedFile.deletedAt
                                        ? new Date(deletedFile.deletedAt).toLocaleDateString()
                                        : "-"}
                                </td>
                                <td className="py-2 px-4">{deletedFile.ownerId}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
