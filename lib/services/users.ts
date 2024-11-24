import * as repo from "../db/repository";

import { getAllActionsByUser } from "./actions";

export function getUser(userId: string) {
  return repo.users.get(userId);
}

export function getUsageReport(userId: string, groupId: number) {
  return getAllActionsByUser(userId, groupId);
}
