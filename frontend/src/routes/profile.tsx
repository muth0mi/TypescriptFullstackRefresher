import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

async function getProfile() {
  const res = await api.auth.me.$get();
  if (!res.ok) throw new Error("Failed to fetch profile");
  return await res.json();
}

function Profile() {
  const { isFetching, error, data } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  return (
    <div className="p-2">
      {isFetching ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-destructive">{error.message}</p>
      ) : (
        <p>{JSON.stringify(data)}</p>
      )}
    </div>
  );
}
