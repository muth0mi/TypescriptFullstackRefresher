import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";

const totalsSchema = z.object({
  expenses: z.number().describe("Total expenses"),
});

const expenseSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().min(0),
  category: z.string().min(1).max(50),
  description: z.string().min(1).max(100),
});

const createExpenseSchema = expenseSchema.omit({ id: true });

type Expense = z.infer<typeof expenseSchema>;

const expenses: Expense[] = [
  {
    id: "982cd8c7-16ae-42b7-9d07-49aff7d4c17e",
    amount: 100,
    category: "Food",
    description: "Grocery shopping",
  },
];

export const expenseRoute = new Hono()
  .get(
    "/totals",
    describeRoute({
      description: "Gets the total expenses",
      responses: {
        200: {
          description: "Successful response",
          content: { "application/json": { schema: resolver(totalsSchema) } },
        },
      },
    }),
    (c) => {
      const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
      return c.json({ expenses: total });
    },
  )
  .get(
    "/",
    describeRoute({
      description: "Gets all expenses",
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": { schema: resolver(z.array(expenseSchema)) },
          },
        },
      },
    }),
    (c) => {
      return c.json({ expenses: expenses });
    },
  )
  .post(
    "/",
    describeRoute({
      description: "Creates a new expense",
      requestBody: {
        description: "Expense to create",
        content: {
          "application/json": {
            schema: createExpenseSchema,
            example: {
              amount: 100,
              category: "Food",
              description: "Example expense",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Successful response",
          content: {
            "application/json": { schema: resolver(expenseSchema) },
          },
        },
      },
    }),
    zValidator("json", createExpenseSchema),
    (c) => {
      const expense = c.req.valid("json");
      expenses.push({ id: expenses.length.toString(), ...expense });
      return c.json(expense, 201);
    },
  )
  .get("/:id", (c) => {
    const { id } = c.req.param();
    const expense = expenses.find((e) => e.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json(expense);
  })
  .delete("/:id", (c) => {
    const { id } = c.req.param();
    const index = expenses.findIndex((e) => e.id === id);
    if (index === -1) {
      return c.notFound();
    }
    expenses.splice(index, 1);
    return c.json(204);
  });
