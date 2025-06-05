import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
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

expenseRoute
  .openapi(
    createRoute({
      path: "/totals",
      method: "get",
      description: "Fetch Totals",
      responses: {
        200: {
          description: "Totals Fetched Successfully",
          content: { "application/json": { schema: totalsSchema } },
        },
      },
    }),
    (c) => {
      const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
      return c.json({ expenses: total });
    },
  )
  .openapi(
    createRoute({
      path: "/",
      method: "post",
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
          content: {
            "application/json": { schema: expenseSchema },
          },
        },
      },
    }),
    (c) => {
      const data = c.req.valid("json");
      const expense = { id: expenses.length.toString(), ...data };
      expenses.push(expense);
      return c.json(expense, 201);
    },
  )
  .openapi(
    createRoute({
      path: "/",
      method: "get",
      description: "Fetch All Expenses",
      responses: {
        200: {
          description: "Expenses Fetched Successfully",
          content: {
            "application/json": { schema: z.array(expenseSchema) },
          },
        },
      },
    }),
    (c) => {
      return c.json(expenses);
    },
  )
  .openapi(
    createRoute({
      path: "/:id",
      method: "get",
      description: "Fetch Expense By ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: expenseSchema.shape.id.description,
          example: expenseSchema.shape.id._def.openapi?.metadata?.example,
        },
      ],
      responses: {
        200: {
          description: "Expense Fetched Successfully",
          content: {
            "application/json": { schema: expenseSchema },
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
  .openapi(
    createRoute({
      path: "/:id",
      method: "delete",
      description: "Delete Expense By ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: expenseSchema.shape.id.description,
          example: expenseSchema.shape.id._def.openapi?.metadata?.example,
        },
      ],
      responses: {
        204: {
          description: "Expense Deleted Successfully",
        },
        404: {
          description: "Expense Not Found",
        },
      },
    }),
    (c) => {
      const { id } = c.req.param();
      const index = expenses.findIndex((e) => e.id === id);
      if (index === -1) {
        return c.notFound();
      }
      expenses.splice(index, 1);
      return c.body(null, 204);
    },
  );
