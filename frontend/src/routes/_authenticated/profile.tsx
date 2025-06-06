import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isFetching, error, data } = useQuery(userQueryOptions);

  return (
    <div className="p-2">
      {isFetching ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-destructive">{error.message}</p>
      ) : (
        <div className="p-2 space-y-2">
          <a href="/api/auth/logout">Logout</a>
          <p>{data.name}</p>
          <p>{data.email}</p>
        </div>
      )}
    </div>
  );
}
