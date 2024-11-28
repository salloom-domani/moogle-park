import * as repo from "../db/repository";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";

// get owner as seperate object

export async function addFile(
  fileName: string,
  fileContent: string,
  ownerId: string,
  groupId: string,
) {
  const file = await repo.files.create(fileName, ownerId, groupId);
  const version = await repo.versions.create(file.id, fileContent);

  return repo.files.update(file.id, { currentVersionId: version.id });
}

export async function getFilesInGroup(groupId: string) {
  return repo.files.getManyByGroup(groupId);
}

export async function getMyDeletedFiles(userId: string) {
  return repo.files.getManyDeletedByUser(userId);
}

export async function deleteFile(fileId: string, userId: string) {
  const file = await repo.files.get(fileId);

  if (!file) {
    throw new NotFoundError("File not found");
  }

  if (file.deletedAt) {
    throw new BadRequestError("File already deleted");
  }

  if (file.state !== "FREE") {
    throw new BadRequestError("File is in use");
  }

  const group = await repo.groups.get(file.groupId);

  if (!group) {
    throw new NotFoundError("Group not found");
  }

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

  if (file.state !== "FREE") {
    throw new BadRequestError("File is in use");
  }

  const groups = await repo.groups.getManyByUser(userId);

  if (!groups.some((group) => group.id === file.groupId)) {
    throw new ForbiddenError("You do not have permission to delete this file");
  }

  const version = await repo.versions.create(file.id, fileContent);

  return repo.files.update(file.id, { currentVersionId: version.id });
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

  if (file.state !== "FREE") {
    throw new BadRequestError("File is in use");
  }

  const groups = await repo.groups.getManyByUser(userId);

  if (!groups.some((group) => group.id === file.groupId)) {
    throw new ForbiddenError("You do not have permission to delete this file");
  }

  return repo.files.update(file.id, { state: "USED" });
}

export async function checkOutFile(fileId: string, userId: string) {
  const file = await repo.files.get(fileId);

  if (!file) {
    throw new NotFoundError("File not found");
  }

  if (file.deletedAt) {
    throw new BadRequestError("File already deleted");
  }

  if (file.state !== "USED") {
    throw new BadRequestError("File is already free");
  }

  const groups = await repo.groups.getManyByUser(userId);

  if (!groups.some((group) => group.id === file.groupId)) {
    throw new ForbiddenError("You do not have permission to delete this file");
  }

  return repo.files.update(file.id, { state: "FREE" });
}

export async function checkInFiles(fileIds: string[], userId: string) {
  const files = await repo.files.getMany(fileIds);

  if (files.some((file) => file.deletedAt)) {
    throw new BadRequestError("Some files are already deleted");
  }

  if (files.some((file) => file.state !== "FREE")) {
    throw new BadRequestError("Some files are already in use");
  }

  const groups = await repo.groups.getManyByUser(userId);

  const canDo = files.every((file) =>
    groups.some((group) => group.id === file.groupId),
  );

  if (!canDo) {
    throw new ForbiddenError(
      "You do not have permission to check in some of these files",
    );
  }

  return repo.files.updateMany(fileIds, { state: "USED" });
}

export async function checkOutFiles(fileIds: string[], userId: string) {
  const files = await repo.files.getMany(fileIds);

  if (files.some((file) => file.deletedAt)) {
    throw new BadRequestError("Some files are already deleted");
  }

  if (files.some((file) => file.state !== "USED")) {
    throw new BadRequestError("Some files are already free");
  }

  const groups = await repo.groups.getManyByUser(userId);

  const canDo = files.every((file) =>
    groups.some((group) => group.id === file.groupId),
  );

  if (!canDo) {
    throw new ForbiddenError(
      "You do not have permission to check out some of these files",
    );
  }

  return repo.files.updateMany(fileIds, { state: "FREE" });
}

export function getUsageReport() {
  // params userId,ownerId, groupId, fileId , reportId
  // check userId
  // check groupId
  // check checkin/out file
  // check the update on file
}
