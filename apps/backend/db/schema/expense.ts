import {
  date,
  numeric,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const expenseTable = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  date: date("date"),
  createdBy: text("created_by").notNull(),
  createdAt: date("created_at").notNull().defaultNow(),
});
