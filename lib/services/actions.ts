import { ActionType } from "@prisma/client";
import * as repo from "../db/repository";

export function addAction(
  fileId: string,
  version: number,
  userId: string,
  actionType: ActionType,
) {
  return repo.actions.create(fileId, version, userId, actionType);
}

export function getAllActionsByUser(userId: string, groupId: string) {
  return repo.actions.getManyByUser(userId, groupId);
}
