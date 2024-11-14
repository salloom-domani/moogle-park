import { eq } from "drizzle-orm";
import { db } from "../db/client";
import * as schema from "../db/schema";

export async function addFile(
  fileName: string,
  fileContent: string,
  ownerId: string,
  groupId: number,
) {
  const currentVersion = 0;

  const [file] = await db
    .insert(schema.files)
    .values({ name: fileName, groupId, ownerId })
    .returning();

  const [version] = await db
    .insert(schema.versions)
    .values({
      fileId: file.id,
      version: currentVersion,
      content: fileContent,
    })
    .returning();

  return db
    .update(schema.files)
    .set({ currentVersion: version.id })
    .where(eq(schema.files.id, file.id));
}

export function deleteFile() {
  // params ownerId, groupId, fileId
  // check if in group
  // check if exists
  // chekc if not used
  // check if owner of file or owner of group
  // delete all versions
  // detele file
}

export function updateFile() {
  // params ownerId, groupId, fileId
  // check if in group
  // check if exists
  // chekc if not used
  // check if owner of file or owner of group
  // new version
  // update file currnet version
}

export function restoreFile() {
  //
  //
}

export function checkInFile() {
  //params userId, groupId, fileId
  // check if in group
  // check if exists
  // chekc if not used
  // mark as checkin file
}

export function checkOutFile() {
   //params userId, groupId, fileId
  // check if in group
  // check if exists
  // chekc if file is checkin
  // check *
  // mark as checkout file
  
}

export function checkInFiles() {
  //params userId, groupId, fileId
  // check if in group
  // check if exists
  // chekc if all files are not used
  // mark all files as checkinfile
}

export function checkoutFiles() {
   //params userId, groupId, fileId
  // check if in group
  // check if exists
  // chekc if file is checkin
  // check *
  // mark files as checkoutfile
}

export function getUsageReport() {}
