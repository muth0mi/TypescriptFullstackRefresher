import type { ApiRoutes } from "@backend/app";
import { hc } from "hono/client";
import { queryOptions } from "@tanstack/react-query";

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

export async function createExpense(value: {
  category: string;
  description: string;
  amount: string;
  date: string;
}) {
  const res = await api.expense.$post({ json: value });
  if (!res.ok) throw new Error("Failed to create expense");
  return await res.json();
}
