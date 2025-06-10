import { z } from "@hono/zod-openapi";

export const totalsSchema = z.object({
  expenses: z
    .number()
    .describe("Total expenses")
    .positive()
    .openapi({ example: 3 }),
  expenditure: z
    .string()
    .describe("Total expenditure")
    .openapi({ example: "1100.40" }),
});

export const expenseSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({ example: "00000000-0000-0000-0000-000000000000" })
    .describe("The ID of the expense"),
  amount: z
    .string()
    .openapi({ example: "100.50" })
    .describe("The amount of the expense")
    .min(1, { message: "Amount must be at least 1 character" })
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Amount must be a valid currency" }),
  category: z
    .string()
    .openapi({ example: "Food" })
    .describe("The category of the expense")
    .min(3, { message: "Category must be at least 3 characters" })
    .max(50, { message: "Category must be at most 50 characters" }),
  description: z
    .string()
    .openapi({ example: "Grocery shopping" })
    .describe("The description of the expense")
    .min(3, { message: "Description must be at least 3 character" })
    .max(100, { message: "Description must be at most 100 characters" }),
  date: z
    .string()
    .openapi({ example: "2023-01-01" })
    .describe("The date of the expense")
    .datetime({ message: "Date must be in YYYY-MM-DD format" })
    .refine((date) => new Date(date).getTime() <= Date.now(), {
      message: "Date cannot be in the future",
    })
    .nullable(),
});
