"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  createGroupSchema,
  deleteGroupSchema,
  addUserToGroupSchema,
  isUserInGroupSchema,
  isGroupOwnerSchema,
} from "@/lib/schemas/groups";
import {
  createGroup,
  deleteGroup,
  addUserToGroup,
  isUserInGroup,
  isGroupOwner,
} from "@/lib/services/groups";
import { revalidatePath } from "next/cache";

export const createGroupAction = authActionClient
  .metadata({ actionName: "createGroup" })
  .schema(createGroupSchema)
  .action(async ({ parsedInput: { name }, ctx }) => {
    const group = await createGroup(name, ctx.user.id);
    return { ok: true, message: "Group created", data: group };
  });

export const deleteGroupAction = authActionClient
  .metadata({ actionName: "deleteGroup" })
  .schema(deleteGroupSchema)
  .action(async ({ parsedInput: { groupId }, ctx }) => {
    try {
      await deleteGroup(groupId, ctx.user.id);
      revalidatePath("/dashboard/groups");
    } catch (err) {
      console.log(err);
      return { ok: false, message: "Sometgnig went wrong" };
    }
    return { ok: true, message: "Group deleted" };
  });

export const addUserToGroupAction = authActionClient
  .metadata({ actionName: "addUserToGroup" })
  .schema(addUserToGroupSchema)
  .action(async ({ parsedInput: { groupId, userId }, ctx }) => {
    await addUserToGroup(groupId, userId, ctx.user.id);
    revalidatePath("/dashboard/groups");
    return { ok: true, message: "User added to group" };
  });

export const isUserInGroupAction = authActionClient
  .metadata({ actionName: "isUserInGroup" })
  .schema(isUserInGroupSchema)
  .action(async ({ parsedInput: { groupId, userId } }) => {
    const isMember = await isUserInGroup(groupId, userId);
    return { ok: true, data: { isMember } };
  });

export const isGroupOwnerAction = authActionClient
  .metadata({ actionName: "isGroupOwner" })
  .schema(isGroupOwnerSchema)
  .action(async ({ parsedInput: { groupId, ownerId } }) => {
    const isOwner = await isGroupOwner(groupId, ownerId);
    return { ok: true, data: { isOwner } };
  });
