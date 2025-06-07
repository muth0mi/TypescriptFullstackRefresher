import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  return (
    <>
      <div className="p-2 max-w-2xl m-auto flex justify-between items-baseline gap-2">
        <Link to="/">
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
        </Link>
        <div className="flex gap-2">
          <Link to="/profile" className="[&.active]:font-bold">
            Profile
          </Link>
          <Link to="/expenses" className="[&.active]:font-bold">
            Expense
          </Link>
          <Link to="/create-expense" className="[&.active]:font-bold">
            Create Expense
          </Link>
        </div>
      </div>
      <hr />
      <div className="p-2 max-w-2xl m-auto">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  );
}
