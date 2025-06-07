import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { and, eq, sum } from "drizzle-orm";
import { db } from "../db";
import { expenseTable } from "../db/schema";
import { userMiddleware } from "../kinde";

const errorSchema = z.object({
  message: z
    .string()
    .describe("Error message")
    .openapi({ example: "Some error message" }),
});

const totalsSchema = z.object({
  expenses: z
    .number()
    .positive()
    .describe("Total expenses")
    .openapi({ example: 1100 }),
});

const expenseSchema = z.object({
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

export const expenseRoute = new OpenAPIHono()
  .openapi(
    createRoute({
      path: "/totals",
      method: "get",
      middleware: [userMiddleware] as const,
      description: "Fetch Totals",
      responses: {
        200: {
          description: "Totals Fetched Successfully",
          content: { "application/json": { schema: totalsSchema } },
        },
      },
    }),
    async (c) => {
      const user = c.var.user;
      const totals = await db
        .select({ expenses: sum(expenseTable.amount) })
        .from(expenseTable)
        .where(eq(expenseTable.userId, user.id))
        .then((res) => res[0])
        .then((totals) => ({ expenses: Number(totals?.expenses) }));
      return c.json(totals, 200);
    },
  )
  .openapi(
    createRoute({
      path: "/",
      method: "post",
      middleware: [userMiddleware] as const,
      description: "Create a New Expense",
      request: {
        body: {
          required: true,
          content: {
            "application/json": { schema: expenseSchema.omit({ id: true }) },
          },
        },
      },
      responses: {
        201: {
          description: "Expense Created Successfully",
          content: { "application/json": { schema: expenseSchema } },
        },
        500: {
          description: "Expense Not Created",
          content: { "application/json": { schema: errorSchema } },
        },
      },
    }),
    async (c) => {
      const data = c.req.valid("json");
      const user = c.var.user;
      const expense = await db
        .insert(expenseTable)
        .values({
          userId: user.id,
          amount: `${data.amount}`,
          category: data.category,
          description: data.description,
        })
        .returning()
        .then((res) => res[0])
        .then((expense) =>
          expense
            ? {
                id: expense.id,
                amount: Number(expense.amount),
                category: expense.category,
                description: expense.description,
              }
            : null,
        );
      if (!expense) {
        return c.json({ message: "Failed to create expense" }, 500);
      }
      return c.json(expense, 201);
    },
  )
  .openapi(
    createRoute({
      path: "/",
      method: "get",
      middleware: [userMiddleware] as const,
      description: "Fetch All Expenses",
      responses: {
        200: {
          description: "Expenses Fetched Successfully",
          content: { "application/json": { schema: z.array(expenseSchema) } },
        },
      },
    }),
    async (c) => {
      const user = c.var.user;
      const expenses = await db
        .select()
        .from(expenseTable)
        .where(eq(expenseTable.userId, user.id))
        .then((res) =>
          res.map((r) => ({
            id: r.id,
            amount: Number(r.amount),
            category: r.category,
            description: r.description,
          })),
        );
      return c.json(expenses, 200);
    },
  )
  .openapi(
    createRoute({
      path: "/{id}",
      method: "get",
      middleware: [userMiddleware] as const,
      description: "Fetch Expense By ID",
      request: {
        params: expenseSchema.pick({ id: true }),
      },
      responses: {
        200: {
          description: "Expense Fetched Successfully",
          content: { "application/json": { schema: expenseSchema } },
        },
        404: {
          description: "Expense Not Found",
          content: { "application/json": { schema: errorSchema } },
        },
      },
    }),
    async (c) => {
      const { id } = c.req.param();
      const user = c.var.user;
      const expense = await db
        .select()
        .from(expenseTable)
        .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
        .then((res) => res[0])
        .then((expense) =>
          expense
            ? {
                id: expense.id,
                amount: Number(expense.amount),
                category: expense.category,
                description: expense.description,
              }
            : null,
        );
      if (!expense) {
        return c.json({ message: "Expense not found" }, 404);
      }
      return c.json(expense, 200);
    },
  )
  .openapi(
    createRoute({
      path: "/{id}",
      method: "delete",
      middleware: [userMiddleware] as const,
      description: "Delete Expense By ID",
      request: {
        params: expenseSchema.pick({ id: true }),
      },
      responses: {
        204: {
          description: "Expense Deleted Successfully",
        },
        404: {
          description: "Expense Not Found",
          content: { "application/json": { schema: errorSchema } },
        },
      },
    }),
    async (c) => {
      const { id } = c.req.param();
      const user = c.var.user;
      const expense = await db
        .delete(expenseTable)
        .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
        .returning()
        .then((res) => res[0]);
      if (!expense) {
        return c.json({ message: "Expense not found" }, 404);
      }
      return c.body(null, 204);
    },
  );
