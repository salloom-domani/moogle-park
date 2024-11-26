import {
  pgEnum,
  pgTable,
  integer,
  timestamp,
  uuid,
  AnyPgColumn,
  text,
  boolean,
  json,
} from "drizzle-orm/pg-core";

// NOTE: AUTH RELATED TABLES

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// NOTE: BUSINESS RELATED TABLES

export const groups = pgTable("groups", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
});

export type Group = typeof groups.$inferSelect;
export type CreateGroup = typeof groups.$inferInsert;

export const groupMembers = pgTable("group_members", {
  groupId: integer("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export type GroupMember = typeof groupMembers.$inferSelect;
export type CreateGroupMember = typeof groupMembers.$inferInsert;

export const fileState = pgEnum("file_state", ["free", "used"]);

export type FileState = (typeof fileState.enumValues)[number];

export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  groupId: integer("group_id")
    .notNull()
    .references(() => groups.id),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
  currentVersion: integer("current_version").references(
    (): AnyPgColumn => versions.id,
  ),
  state: fileState("state").notNull().default("free"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

export type File = typeof files.$inferSelect;
export type CreateFile = typeof files.$inferInsert;

export const versions = pgTable("versions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fileId: uuid("file_id")
    .notNull()
    .references(() => files.id),
  content: text("content"),
  diff: json("diff"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Version = typeof versions.$inferSelect;
export type CreateVersion = typeof versions.$inferInsert;

export const action = pgEnum("action", [
  "create",
  "delete",
  "check-in",
  "check-out",
  "restore",
]);

export type ActionType = (typeof action.enumValues)[number];

export const actions = pgTable("actions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fileId: uuid("file_id")
    .notNull()
    .references(() => files.id),
  version: integer("version").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  action: action().notNull(),
});

export type Action = typeof actions.$inferSelect;
export type CreateAction = typeof actions.$inferInsert;
