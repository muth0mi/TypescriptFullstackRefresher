import {
  date,
  numeric,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  picture: varchar("picture", { length: 255 }).notNull(),
});

export const expenseTable = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  date: date("date"),
  createdBy: text("created_by").notNull(),
  createdAt: date("created_at").notNull().defaultNow(),
});
