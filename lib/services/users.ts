import { getAllActionsByUser } from "./actions";

export function getUsageReport(userId: string, groupId: number) {
  return getAllActionsByUser(userId, groupId);
}
