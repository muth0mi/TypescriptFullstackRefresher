import { numeric, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const expenseTable = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
});
