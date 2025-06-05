import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { expenseRoute } from "./route/expense";

const app = new OpenAPIHono();

// Initialize middleware
app.use("*", logger());

// Initialize routes
const apiRoutes = app.route("/api/expense", expenseRoute);

// Serve OpenAPI specification
app.doc31("/openapi", (c) => ({
  openapi: "3.1.0",
  info: {
    title: "Expense Tracker",
    version: "1.0.0",
    description: "API for tracking and managing expenses",
  },
  servers: [
    {
      url: new URL(c.req.url).origin,
      description: "Current environment",
    },
  ],
}));

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
export type ApiRoutes = typeof apiRoutes;
