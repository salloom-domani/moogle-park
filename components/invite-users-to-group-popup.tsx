"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAction } from "next-safe-action/hooks";
import { addUserToGroupAction } from "@/actions/groups";

type User = {
    id: string;
    email: string;
    name: string;
    image?: string | null;
};

type InviteUsersPopoverProps = {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
    allUsers: User[];
    groupMembers: User[];
};

export const InviteUsersPopover: React.FC<InviteUsersPopoverProps> = ({
                                                                          isOpen,
                                                                          onClose,
                                                                          groupId,
                                                                          allUsers,
                                                                          groupMembers,
                                                                      }) => {
    const [filter, setFilter] = useState("");
    const { toast } = useToast();
    const { executeAsync, isPending } = useAction(addUserToGroupAction);

    const usersNotInGroup = allUsers.filter(
        (user) => !groupMembers.some((member) => member.id === user.id)
    );

    const handleInvite = async (userId: string) => {
        try {
            await executeAsync({ groupId, userId });
            toast({
                title: "User Invited 🎉",
                description: `The user has been successfully invited to the group.`,
                variant: "success",
            });
        } catch (err) {
            toast({
                title: "Failed to Invite User ❌",
                description: `Could not invite the user. Please try again. ${err}`,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl mx-auto">
                <DialogHeader>
                    <DialogTitle>Invite Users to Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <h3 className="font-semibold">Group Members</h3>
                    <ul className="space-y-2">
                        {groupMembers.map((member) => (
                            <li key={member.id} className="flex items-center gap-3">
                                <Image
                                    src={member.image || "/default-avatar.png"}
                                    alt="User Avatar"
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                                <span>{member.name || member.email}</span>
                                <span className="text-gray-400 text-sm">Member</span>
                            </li>
                        ))}
                    </ul>
                    <h3 className="font-semibold mt-4">Invite Users</h3>
                    <Input
                        type="text"
                        placeholder="Search Users"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <ul className="space-y-2 mt-2">
                        {usersNotInGroup
                            .filter((user) =>
                                user.email.toLowerCase().includes(filter.toLowerCase())
                            )
                            .map((user) => (
                                <li
                                    key={user.id}
                                    className="flex items-center gap-3 hover:bg-muted p-2 rounded"
                                >
                                    <Image
                                        src={user.image || "/default-avatar.png"}
                                        alt="User Avatar"
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                    <span>{user.name || user.email}</span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleInvite(user.id)}
                                        disabled={isPending}
                                    >
                                        {isPending ? "Inviting..." : "Invite"}
                                    </Button>
                                </li>
                            ))}
                    </ul>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
