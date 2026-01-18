import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";

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
    condition: varchar({ length: 4 }).notNull(),
});