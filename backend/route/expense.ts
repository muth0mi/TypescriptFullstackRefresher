import { Hono } from "hono";

type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
};

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
  .post("/", async (c) => {
    const expense = await c.req.json();
    expenses.push(expense);
    return c.json(expense);
  });
