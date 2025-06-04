import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

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
    id: "1",
    amount: 100,
    category: "Food",
    description: "Grocery shopping",
  },
  {
    id: "2",
    amount: 50,
    category: "Transportation",
    description: "Gas",
  },
  {
    id: "3",
    amount: 200,
    category: "Entertainment",
    description: "Concert tickets",
  },
];

export const expenseRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: expenses });
  })
  .post("/", zValidator("json", createExpenseSchema), (c) => {
    const expense = c.req.valid("json");
    expenses.push({ id: expenses.length.toString(), ...expense });
    return c.json(expense, 201);
  })
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
