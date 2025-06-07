import { z } from "@hono/zod-openapi";

export const totalsSchema = z.object({
  expenses: z
    .number()
    .positive()
    .describe("Total expenses")
    .openapi({ example: 1100 }),
});

export const expenseSchema = z.object({
  id: z
    .string()
    .uuid()
    .describe("The ID of the expense")
    .openapi({ example: "982cd8c7-16ae-42b7-9d07-49aff7d4c17e" }),
  amount: z
    .number()
    .min(0)
    .describe("The amount of the expense")
    .openapi({ example: 100 }),
  category: z
    .string()
    .min(1)
    .max(50)
    .describe("The category of the expense")
    .openapi({ example: "Food" }),
  description: z
    .string()
    .min(1)
    .max(100)
    .describe("The description of the expense")
    .openapi({ example: "Grocery shopping" }),
});
