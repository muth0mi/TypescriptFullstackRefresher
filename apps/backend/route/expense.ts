import { errorSchema, expenseSchema, totalsSchema } from "@app/shared";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { and, count, eq, sum } from "drizzle-orm";
import { db } from "../db";
import { expenseTable } from "../db/schema";
import { userMiddleware } from "../kinde";

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
        .select({
          expenses: count(expenseTable),
          expenditure: sum(expenseTable.amount),
        })
        .from(expenseTable)
        .where(eq(expenseTable.createdBy, user.id))
        .then((res) => res[0])
        .then((totals) => ({
          expenses: Number(totals?.expenses),
          expenditure: totals?.expenditure,
        }));
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
        .values({ ...data, createdBy: user.id })
        .returning()
        .then((res) => res[0])
        .then((expense) =>
          expense
            ? {
                id: expense.id,
                amount: expense.amount,
                category: expense.category,
                description: expense.description,
                date: expense.date,
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
        .where(eq(expenseTable.createdBy, user.id))
        .then((res) =>
          res.map((expense) => ({
            id: expense.id,
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            date: expense.date,
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
        .where(
          and(eq(expenseTable.createdBy, user.id), eq(expenseTable.id, id)),
        )
        .then((res) => res[0])
        .then((expense) =>
          expense
            ? {
                id: expense.id,
                amount: expense.amount,
                category: expense.category,
                description: expense.description,
                date: expense.date,
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
        .where(
          and(eq(expenseTable.createdBy, user.id), eq(expenseTable.id, id)),
        )
        .returning()
        .then((res) => res[0]);
      if (!expense) {
        return c.json({ message: "Expense not found" }, 404);
      }
      return c.body(null, 204);
    },
  );
