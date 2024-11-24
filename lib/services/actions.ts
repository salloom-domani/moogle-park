import * as repo from "../db/repository";
import { ActionType } from "../db/schema";

export function addAction(
  fileId: string,
  version: number,
  userId: string,
  actionType: ActionType,
) {
  return repo.actions.create(fileId, version, userId, actionType);
}

export function getAllActionsByUser(userId: string, groupId: number) {
  return repo.actions.getManyByUser(userId, groupId);
}
