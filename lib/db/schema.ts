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
  expiresAt: timestamp("expiresAt"),
  password: text("password"),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

// NOTE: BUSINESS RELATED TABLES

export const groups = pgTable("groups", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  ownerId: text()
    .notNull()
    .references(() => users.id),
});

export const groupMembers = pgTable("group_members", {
  groupId: integer()
    .notNull()
    .references(() => groups.id),
  userId: text()
    .notNull()
    .references(() => users.id),
});

export const files = pgTable("files", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  groupId: integer()
    .notNull()
    .references(() => groups.id),
  ownerId: text()
    .notNull()
    .references(() => users.id),
  currentVersion: integer().references((): AnyPgColumn => versions.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const versions = pgTable("versions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fileId: uuid()
    .notNull()
    .references(() => files.id),
  version: integer().notNull(),
  content: text(),
  diff: json(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const action = pgEnum("action", [
  "create",
  "delete",
  "check-in",
  "check-out",
  "restore",
]);

export const actions = pgTable("actions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fileId: uuid()
    .notNull()
    .references(() => files.id),
  version: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  userId: text()
    .notNull()
    .references(() => users.id),
  action: action().notNull(),
});
