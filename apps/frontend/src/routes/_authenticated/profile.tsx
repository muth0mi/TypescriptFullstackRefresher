import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Avatar>
              {data?.picture && <AvatarImage src={data.picture} />}
              <AvatarFallback>{data?.name ?? "USR"}</AvatarFallback>
            </Avatar>
            <p>{data?.name}</p>
          </div>

          <Button asChild variant="destructive">
            <a href="/api/auth/logout">Logout</a>
          </Button>
        </div>
      )}
    </div>
  );
}
