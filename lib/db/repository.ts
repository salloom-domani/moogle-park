import { eq, and, inArray } from "drizzle-orm";
import { db } from "../db/client";
import * as schema from "../db/schema";

export const users = {
  async get(id: string) {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return user;
  },
};

export const groups = {
  async get(id: number) {
    const [group] = await db
      .select()
      .from(schema.groups)
      .where(eq(schema.groups.id, id));
    return group;
  },

  async create(name: string, ownerId: string) {
    const [group] = await db
      .insert(schema.groups)
      .values({ name, ownerId })
      .returning();
    return group;
  },

  async delete(id: number) {
    return db.delete(schema.groups).where(eq(schema.groups.id, id));
  },
};

export const members = {
  async get(userId: string) {
    const [member] = await db
      .select()
      .from(schema.groupMembers)
      .where(eq(schema.groupMembers.userId, userId));

    return member;
  },

  async create(groupId: number, userId: string) {
    const [member] = await db
      .insert(schema.groupMembers)
      .values({ groupId, userId })
      .returning();
    return member;
  },
};

export const files = {
  async get(id: string) {
    const [file] = await db
      .select()
      .from(schema.files)
      .where(eq(schema.files.id, id));
    return file;
  },

  async getMany(ids: string[]) {
    const files = await db
      .select()
      .from(schema.files)
      .where(inArray(schema.files.id, ids));
    return files;
  },

  async create(name: string, ownerId: string, groupId: number) {
    const [file] = await db
      .insert(schema.files)
      .values({ name, groupId, ownerId })
      .returning();
    return file;
  },

  async update(id: string, data: Partial<schema.CreateFile>) {
    return db.update(schema.files).set(data).where(eq(schema.files.id, id));
  },

  async updateMany(ids: string[], data: Partial<schema.CreateFile>) {
    return db
      .update(schema.files)
      .set(data)
      .where(inArray(schema.files.id, ids));
  },
};

export const versions = {
  async create(fileId: string, content: string) {
    const [version] = await db
      .insert(schema.versions)
      .values({
        fileId,
        content,
      })
      .returning();
    return version;
  },
};

export const actions = {
  async getManyByUser(userId: string, groupId: number) {
    const actions = await db
      .select()
      .from(schema.actions)
      .innerJoin(
        schema.groupMembers,
        eq(schema.groupMembers.userId, schema.actions.userId),
      )
      .where(
        and(
          eq(schema.groupMembers.groupId, groupId),
          eq(schema.actions.userId, userId),
        ),
      );
    return actions;
  },

  async create(
    fileId: string,
    version: number,
    userId: string,
    actionType: schema.ActionType,
  ) {
    const [action] = await db
      .insert(schema.actions)
      .values({ fileId, userId, action: actionType, version })
      .returning();
    return action;
  },
};
