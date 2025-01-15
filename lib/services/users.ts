import * as repo from "../db/repository";

import { getAllActionsByUser } from "./actions";

export function getUser(userId: string) {
  return repo.users.get(userId);
}

export function getUsageReport(userId: string, groupId: string) {
  return getAllActionsByUser(userId, groupId);
}

export async function getAllUsers() {
  return repo.users.getAll();
}
