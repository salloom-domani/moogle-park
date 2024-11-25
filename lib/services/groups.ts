import * as repo from "../db/repository";
import { ForbiddenError } from "../errors";

export function getMyGroups(userId: string) {
  return repo.groups.getManyByUser(userId);
}

export function createGroup(name: string, ownerId: string) {
  return repo.groups.create(name, ownerId);
}

export async function deleteGroup(groupId: number, ownerId: string) {
  const isOwner = await isGroupOwner(groupId, ownerId);
  if (!isOwner) {
    throw new ForbiddenError(
      `User ${ownerId} is not the owner of group ${groupId}`,
    );
  }

  return repo.groups.delete(groupId);
}

export async function addUserToGroup(
  groupId: number,
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

export async function isUserInGroup(groupId: number, userId: string) {
  const member = await repo.members.get(userId);
  return member.groupId === groupId;
}

export async function isGroupOwner(groupId: number, ownerId: string) {
  const group = await repo.groups.get(groupId);

  return group.ownerId === ownerId;
}
