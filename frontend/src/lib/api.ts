import type { ApiRoutes } from "@backend/app";
import { expenseSchema } from "@backend/schema/expense";
import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";
import { z } from "zod";

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getProfile() {
  const res = await api.auth.me.$get();
  if (!res.ok) throw new Error("Failed to fetch profile");
  return await res.json();
}

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  queryFn: getProfile,
  staleTime: Infinity,
});

async function fetchExpenses() {
  const res = await api.expense.$get();
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return await res.json();
}

export const expensesQueryOptions = queryOptions({
  queryKey: ["expenses"],
  queryFn: fetchExpenses,
  staleTime: Infinity,
});

export const createExpenseSchema = expenseSchema.omit({ id: true });
type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export async function createExpense(value: CreateExpenseInput) {
  const res = await api.expense.$post({ json: value });
  if (!res.ok) throw new Error("Failed to create expense");
  return await res.json();
}
