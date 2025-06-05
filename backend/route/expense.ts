import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import "zod-openapi/extend";

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

type Expense = z.infer<typeof expenseSchema>;

const expenses: Expense[] = [
  {
    id: "982cd8c7-16ae-42b7-9d07-49aff7d4c17e",
    amount: 100,
    category: "Food",
    description: "Grocery shopping",
  },
];

export const expenseRoute = new OpenAPIHono();

const createExpenseRoute = createRoute({
  path: "/",
  method: "post",
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
      content: {
        "application/json": { schema: expenseSchema },
      },
    },
  },
});

expenseRoute.openapi(createExpenseRoute, (c) => {
  const data = c.req.valid("json");
  const expense = { id: expenses.length.toString(), ...data };
  expenses.push(expense);
  return c.json(expense, 201);
});

expenseRoute
  .get(
    "/totals",
    describeRoute({
      description: "Gets the total expenses",
      responses: {
        200: {
          description: "Totals",
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
          description: "Expenses",
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
  .get(
    "/:id",
    describeRoute({
      description: "Get expense by ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: resolver(expenseSchema.pick({ id: true })),
          // description: "The expense ID",
          // example: "982cd8c7-16ae-42b7-9d07-49aff7d4c17e",
        },
      ],
      responses: {
        200: {
          description: "Retrieved Expense",
          content: {
            "application/json": { schema: resolver(expenseSchema) },
          },
        },
        404: {
          description: "Expense Not Found",
        },
      },
    }),
    (c) => {
      const { id } = c.req.param();
      const expense = expenses.find((e) => e.id === id);
      if (!expense) {
        return c.notFound();
      }
      return c.json(expense);
    },
  )
  .delete("/:id", (c) => {
    const { id } = c.req.param();
    const index = expenses.findIndex((e) => e.id === id);
    if (index === -1) {
      return c.notFound();
    }
    expenses.splice(index, 1);
    return c.json(204);
  });
