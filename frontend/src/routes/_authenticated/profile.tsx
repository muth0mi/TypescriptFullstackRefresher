import { Button } from "@/components/ui/button";
import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isFetching, error, data } = useQuery(userQueryOptions);

  return (
    <div>
      {isFetching ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-destructive">{error.message}</p>
      ) : (
        <div className="space-y-2">
          <Button variant="destructive">
            <a href="/api/auth/logout">Logout</a>
          </Button>
          <p>{data?.name}</p>
          <p>{data?.email}</p>
        </div>
      )}
    </div>
  );
}
