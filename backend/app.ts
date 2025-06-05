import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { expenseRoute } from "./route/expense";

const app = new OpenAPIHono();

// Initialize middleware
app.use("*", logger());

// Initialize routes
app.route("/api/expense", expenseRoute);

// Serve OpenAPI specification
app.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    title: "Expense Tracker API",
    version: "1.0.0",
    description: "API for tracking and managing expenses",
  },
});
app.get(
  "/doc",
  Scalar({
    url: "/openapi",
    theme: "saturn",
  }),
);

// Serve static files from the frontend directory
app.use("*", serveStatic({ root: "../frontend/dist" }));
app.get("*", serveStatic({ path: "../frontend/dist/index.html" }));

export default app;
