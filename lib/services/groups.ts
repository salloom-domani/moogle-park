import { eq } from "drizzle-orm";
import { db } from "../db/client";
import * as schema from "../db/schema";

export function createGroup(name: string, ownerId: string) {
  return db.insert(schema.groups).values({ name, ownerId });
}

export async function deleteGroup(groupId: number, ownerId: string) {
  const isOwner = await isGroupOwner(groupId, ownerId);
  if (isOwner) {
    throw new Error(`User ${ownerId} is not the owner of group ${groupId}`);
  }

  return db.delete(schema.groups).where(eq(schema.groups.id, groupId));
}

export async function addUserToGroup(
  groupId: number,
  userId: string,
  ownerId: string,
) {
  const isOwner = await isGroupOwner(groupId, ownerId);
  if (isOwner) {
    throw new Error(`User ${ownerId} is not the owner of group ${groupId}`);
  }

  return db.insert(schema.groupMembers).values({ groupId, userId });
}

export function isUserInGroup() {}

export async function isGroupOwner(groupId: number, ownerId: string) {
  const [group] = await db
    .select()
    .from(schema.groups)
    .where(eq(schema.groups.id, groupId));

  return group.ownerId === ownerId;
}
