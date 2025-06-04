import { Hono } from "hono";
import { logger } from "hono/logger";
import { expenseRoute } from "./route/expense";

const app = new Hono();

app.use("*", logger());

app.route("/api/expense", expenseRoute);

export default app;
