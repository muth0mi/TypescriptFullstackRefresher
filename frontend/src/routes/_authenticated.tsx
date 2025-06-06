import { userQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;
    try {
      return { user: await queryClient.fetchQuery(userQueryOptions) };
    } catch (_) {
      return { user: null };
    }
  },
  component: Authenticated,
});

function Authenticated() {
  const { user } = Route.useRouteContext();
  if (user) return <Outlet />;
  return (
    <div className="p-2 flex flex-col gap-2">
      <a href="/api/auth/login">Login</a>
      <a href="/api/auth/register">Register</a>
    </div>
  );
}
