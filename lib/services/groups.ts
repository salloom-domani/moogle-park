import * as repo from "../db/repository";
import { ForbiddenError, NotFoundError } from "../errors";

export function getMyGroups(userId: string) {
  return repo.groups.getManyByUser(userId);
}

export async function createGroup(name: string, ownerId: string) {
  const group = await repo.groups.create(name, ownerId);
  return addUserToGroup(group.id, ownerId, ownerId);
}

export async function deleteGroup(groupId: string, ownerId: string) {
  const isOwner = await isGroupOwner(groupId, ownerId);
  if (!isOwner) {
    throw new ForbiddenError(
      `User ${ownerId} is not the owner of group ${groupId}`,
    );
  }

  return repo.groups.delete(groupId);
}

export async function addUserToGroup(
  groupId: string,
  userId: string,
  ownerId: string,
) {
  const isOwner = await isGroupOwner(groupId, ownerId);
  if (!isOwner) {
    throw new ForbiddenError(
      `User ${ownerId} is not the owner of group ${groupId}`,
    );
  }

  return repo.members.create(groupId, userId);
}

export async function isUserInGroup(groupId: string, userId: string) {
  const groups = await repo.groups.getManyByUser(userId);
  return groups?.some((group) => group.id === groupId);
}

export async function isGroupOwner(groupId: string, ownerId: string) {
  const group = await repo.groups.get(groupId);

  if (!group) {
    throw new NotFoundError("Group not found");
  }

  return group.ownerId === ownerId;
}
