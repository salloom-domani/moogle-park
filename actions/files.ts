"use server";

import {authActionClient} from "@/lib/safe-action";
import {
    addFileSchema,
    deleteFileSchema,
    updateFileSchema,
    getFilesInGroupSchema,
    checkInFileSchema,
    checkOutFileSchema,
    checkInFilesSchema,
    checkOutFilesSchema,
} from "@/lib/schemas/files";

import {
    addFile,
    deleteFile,
    updateFile,
    getFilesInGroup,
    checkInFile,
    checkOutFile,
    checkInFiles,
    checkOutFiles,
} from "@/lib/services/files";

export const addFileAction = authActionClient
    .metadata({actionName: "addFile"})
    .schema(addFileSchema)
    .action(async ({parsedInput: {fileName, fileContent, ownerId, groupId}}) => {
        const file = await addFile(fileName, fileContent, ownerId, groupId);
        return {ok: true, message: "File added", data: file};
    });

export const deleteFileAction = authActionClient
    .metadata({actionName: "deleteFile"})
    .schema(deleteFileSchema)
    .action(async ({parsedInput: {fileId, userId}}) => {
        await deleteFile(fileId, userId);
        return {ok: true, message: "File deleted"};
    });

export const updateFileAction = authActionClient
    .metadata({actionName: "updateFile"})
    .schema(updateFileSchema)
    .action(async ({parsedInput: {fileId, fileContent, userId}}) => {
        const updatedFile = await updateFile(fileId, fileContent, userId);
        return {ok: true, message: "File updated", data: updatedFile};
    });

export const getFilesInGroupAction = authActionClient
    .metadata({actionName: "getFilesInGroup"})
    .schema(getFilesInGroupSchema)
    .action(async ({parsedInput: {groupId}}) => {
        const files = await getFilesInGroup(groupId);
        return {ok: true, data: files};
    });

export const checkInFileAction = authActionClient
    .metadata({actionName: "checkInFile"})
    .schema(checkInFileSchema)
    .action(async ({parsedInput: {fileId, userId}}) => {
        const file = await checkInFile(fileId, userId);
        return {ok: true, message: "File checked in", data: file};
    });

export const checkOutFileAction = authActionClient
    .metadata({actionName: "checkOutFile"})
    .schema(checkOutFileSchema)
    .action(async ({parsedInput: {fileId, userId}}) => {
        const file = await checkOutFile(fileId, userId);
        return {ok: true, message: "File checked out", data: file};
    });

export const checkInFilesAction = authActionClient
    .metadata({actionName: "checkInFiles"})
    .schema(checkInFilesSchema)
    .action(async ({parsedInput: {fileIds, userId}}) => {
        const files = await checkInFiles(fileIds, userId);
        return {ok: true, message: "Files checked in", data: files};
    });

export const checkOutFilesAction = authActionClient
    .metadata({actionName: "checkOutFiles"})
    .schema(checkOutFilesSchema)
    .action(async ({parsedInput: {fileIds, userId}}) => {
        const files = await checkOutFiles(fileIds, userId);
        return {ok: true, message: "Files checked out", data: files};
    });
