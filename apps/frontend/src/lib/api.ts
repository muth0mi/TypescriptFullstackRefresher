import type { ApiRoutes } from "@app/api/app";
import { expenseSchema } from "@app/shared";
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

export async function createExpense(
  value: Omit<z.infer<typeof expenseSchema>, "id">,
) {
  const res = await api.expense.$post({ json: value });
  if (!res.ok) throw new Error("Failed to create expense");
  return await res.json();
}

export async function deleteExpense(id: string) {
  const res = await api.expense[":id"].$delete({ param: { id: id } });
  if (!res.ok) throw new Error("Failed to delete expense");
}
