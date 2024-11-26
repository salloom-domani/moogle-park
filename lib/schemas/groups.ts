import {z} from "zod";

export const createGroupSchema = z.object({
    name: z.string(),
});

export const deleteGroupSchema = z.object({
    groupId: z.number(),
});

export const addUserToGroupSchema = z.object({
    groupId: z.number(),
    userId: z.string(),
});

export const isUserInGroupSchema = z.object({
    groupId: z.number(),
    userId: z.string(),
});

export const isGroupOwnerSchema = z.object({
    groupId: z.number(),
    ownerId: z.string(),
});

