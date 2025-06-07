import { z } from "@hono/zod-openapi";

export const totalsSchema = z.object({
  expenses: z
    .number()
    .describe("Total expenses")
    .positive()
    .openapi({ example: 1100 }),
});

export const expenseSchema = z.object({
  id: z
    .string()
    .uuid()
    .describe("The ID of the expense")
    .openapi({ example: "982cd8c7-16ae-42b7-9d07-49aff7d4c17e" }),
  amount: z
    .string()
    .describe("The amount of the expense")
    .min(1, { message: "Amount must be at least 1 character" })
    .max(10, { message: "Amount must be at most 10 characters" })
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Amount must be a valid currency" })
    .openapi({ example: "100.50" }),
  category: z
    .string()
    .describe("The category of the expense")
    .min(3, { message: "Category must be at least 3 characters" })
    .max(50, { message: "Category must be at most 50 characters" })
    .openapi({ example: "Food" }),
  description: z
    .string()
    .describe("The description of the expense")
    .min(3, { message: "Description must be at least 3 character" })
    .max(100, { message: "Description must be at most 100 characters" })
    .openapi({ example: "Grocery shopping" }),
});
