import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { logger } from "hono/logger";
import { authRoute } from "./route/auth";
import { expenseRoute } from "./route/expense";

const app = new OpenAPIHono();

// Initialize middleware
app.use("*", logger());

// Initialize routes
const apiRoutes = app
  .route("/api/expense", expenseRoute)
  .route("/api/auth", authRoute);

// Serve OpenAPI specification
app.doc31("/api/openapi", (c) => ({
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
  "/api/doc",
  Scalar({
    url: "/api/openapi",
    theme: "saturn",
  }),
);

export default app;
export type ApiRoutes = typeof apiRoutes;
