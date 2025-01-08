import { ActionType, FileState, Prisma } from "@prisma/client";
import { db } from "../db/client";

export const users = {
  async get(id: string) {
    return db.user.findUnique({ where: { id } });
  },
};

export const groups = {
  async get(id: string) {
    return db.group.findUnique({ where: { id } });
  },

  async getManyByUser(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { groups: true },
    });
    return user?.groups ?? [];
  },

  async create(name: string, ownerId: string) {
    return db.group.create({ data: { name, ownerId } });
  },

  async delete(id: string) {
    return db.group.delete({ where: { id } });
  },
};

export const members = {
  // async get(userId: string) {
  //   const [member] = await db
  //     .select()
  //     .from(schema.groupMembers)
  //     .where(eq(schema.groupMembers.userId, userId));
  //
  //   return member;
  // },
  //
  async create(groupId: string, userId: string) {
    return db.group.update({
      where: { id: groupId },
      data: { users: { connect: { id: userId } } },
    });
  },
};

export const files = {
  async get(id: string) {
    return db.file.findUnique({ where: { id } });
  },

  async getManyByGroup(groupId: string) {
    return db.file.findMany({ where: { groupId } });
  },

  async getManyDeletedByUser(userId: string) {
    return db.file.findMany({
      where: {
        ownerId: userId,
        deletedAt: { not: null },
      },
    });
  },

  async getMany(ids: string[]) {
    return db.file.findMany({ where: { id: { in: ids } } });
  },

  async create(name: string, ownerId: string, groupId: string) {
    return db.file.create({
      data: { name, ownerId, groupId },
    });
  },

  async update(
    id: string,
    {
      currentVersionId,
      state,
      deletedAt,
    }: { currentVersionId?: number; state?: FileState; deletedAt?: Date },
  ) {
    return db.file.update({
      where: { id },
      data: { currentVersionId, state, deletedAt },
    });
  },

  async updateMany(ids: string[], data: Prisma.FileUpdateInput) {
    return db.file.updateMany({ where: { id: { in: ids } }, data });
  },
};

export const versions = {
  async create(fileId: string, content: string) {
    return db.version.create({ data: { fileId, content } });
  },
};

export const actions = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getManyByUser(userId: string, groupId: string) {
    return db.action.findMany({
      where: {
        userId,
      },
    });
  },

  async create(
    fileId: string,
    _version: number,
    userId: string,
    actionType: ActionType,
  ) {
    return db.action.create({
      data: {
        file: { connect: { id: fileId } },
        user: { connect: { id: userId } },
        actionType,
      },
    });
  },
};
