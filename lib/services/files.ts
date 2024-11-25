import * as repo from "../db/repository";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";

export async function addFile(
  fileName: string,
  fileContent: string,
  ownerId: string,
  groupId: number,
) {
  const file = await repo.files.create(fileName, ownerId, groupId);
  const version = await repo.versions.create(file.id, fileContent);

  return repo.files.update(file.id, { currentVersion: version.id });
}

export async function getFilesInGroup(groupId: number) {
  return repo.files.getManyByGroup(groupId);
}

export async function deleteFile(fileId: string, userId: string) {
  const file = await repo.files.get(fileId);

  if (!file) {
    throw new NotFoundError("File not found");
  }

  if (file.deletedAt) {
    throw new BadRequestError("File already deleted");
  }

  if (file.state !== "free") {
    throw new BadRequestError("File is in use");
  }

  const group = await repo.groups.get(file.groupId);

  if (file.ownerId !== userId || group.ownerId !== userId) {
    throw new ForbiddenError("You do not have permission to delete this file");
  }

  return repo.files.update(file.id, { deletedAt: new Date() });
}

export async function updateFile(
  fileId: string,
  fileContent: string,
  userId: string,
) {
  const file = await repo.files.get(fileId);

  if (!file) {
    throw new NotFoundError("File not found");
  }

  if (file.deletedAt) {
    throw new BadRequestError("File already deleted");
  }

  if (file.state !== "free") {
    throw new BadRequestError("File is in use");
  }

  const member = await repo.members.get(userId);

  if (member.groupId !== file.groupId) {
    throw new ForbiddenError("You do not have permission to delete this file");
  }

  const version = await repo.versions.create(file.id, fileContent);

  return repo.files.update(file.id, { currentVersion: version.id });
}

export function restoreFile() {
  //
}

export async function checkInFile(fileId: string, userId: string) {
  const file = await repo.files.get(fileId);

  if (!file) {
    throw new NotFoundError("File not found");
  }

  if (file.deletedAt) {
    throw new BadRequestError("File already deleted");
  }

  if (file.state !== "free") {
    throw new BadRequestError("File is in use");
  }

  const member = await repo.members.get(userId);

  if (member.groupId !== file.groupId) {
    throw new ForbiddenError("You do not have permission to delete this file");
  }

  return repo.files.update(file.id, { state: "used" });
}

export async function checkOutFile(fileId: string, userId: string) {
  const file = await repo.files.get(fileId);

  if (!file) {
    throw new NotFoundError("File not found");
  }

  if (file.deletedAt) {
    throw new BadRequestError("File already deleted");
  }

  if (file.state !== "used") {
    throw new BadRequestError("File is already free");
  }

  const member = await repo.members.get(userId);

  if (member.groupId !== file.groupId) {
    throw new ForbiddenError("You do not have permission to delete this file");
  }

  return repo.files.update(file.id, { state: "free" });
}

export async function checkInFiles(fileIds: string[], userId: string) {
  const files = await repo.files.getMany(fileIds);

  if (files.some((file) => file.deletedAt)) {
    throw new BadRequestError("Some files are already deleted");
  }

  if (files.some((file) => file.state !== "free")) {
    throw new BadRequestError("Some files are already in use");
  }

  const member = await repo.members.get(userId);

  if (files.some((file) => member.groupId !== file.groupId)) {
    throw new ForbiddenError(
      "You do not have permission to check in some of these files",
    );
  }

  return repo.files.updateMany(fileIds, { state: "used" });
}

export async function checkOutFiles(fileIds: string[], userId: string) {
  const files = await repo.files.getMany(fileIds);

  if (files.some((file) => file.deletedAt)) {
    throw new BadRequestError("Some files are already deleted");
  }

  if (files.some((file) => file.state !== "used")) {
    throw new BadRequestError("Some files are already free");
  }

  const member = await repo.members.get(userId);

  if (files.some((file) => member.groupId !== file.groupId)) {
    throw new ForbiddenError(
      "You do not have permission to check out some of these files",
    );
  }

  return repo.files.updateMany(fileIds, { state: "free" });
}

export function getUsageReport() {
  // params userId,ownerId, groupId, fileId , reportId
  // check userId
  // check groupId
  // check checkin/out file
  // check the update on file
}
