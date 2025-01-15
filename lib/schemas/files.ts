import { z } from "zod";

export const addFileSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileContent: z.string().min(1, "File content is required"),
  ownerId: z.string(),
  groupId: z.string(),
});

export const deleteFileSchema = z.object({
  fileId: z.string().uuid(),
  userId: z.string(),
});

export const updateFileSchema = z.object({
  fileId: z.string().uuid(),
  fileContent: z.string().min(1, "File content is required"),
  userId: z.string(),
});

export const getFilesInGroupSchema = z.object({
  groupId: z.string(),
});

export const checkInFileSchema = z.object({
  fileId: z.string().uuid(),
  userId: z.string(),
});

export const getFileByIdSchema = z.object({
  fileId: z.string().uuid("Invalid file ID"),
});

export const checkOutFileSchema = z.object({
  fileId: z.string().uuid(),
  userId: z.string(),
});

export const checkInFilesSchema = z.object({
  fileIds: z.array(z.string().uuid()).nonempty(),
  userId: z.string(),
});

export const checkOutFilesSchema = z.object({
  fileIds: z.array(z.string().uuid()).nonempty(),
  userId: z.string(),
});
