import { integer, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    address: text().notNull(),
});

export const games = pgTable("games", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    userId: integer("user_id").notNull().references(() => users.id),
    publisher: varchar({ length: 255 }).notNull(),
    publishYear: integer("publish_year").notNull(),
    sys: varchar({ length: 255 }).notNull(),
    condition: varchar({ length: 16 }).notNull(),
});

export const offers = pgTable("offers", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    requesterUserId: integer("requester_user_id").notNull().references(() => users.id),
    ownerUserId: integer("owner_user_id").notNull().references(() => users.id),
    offeredGameId: integer("offered_game_id").notNull().references(() => games.id),
    requestedGameId: integer("requested_game_id").notNull().references(() => games.id),
    status: varchar({ length: 16 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

