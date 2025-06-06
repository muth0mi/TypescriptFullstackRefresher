import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

async function fetchTotals() {
  const res = await api.expense["totals"].$get();
  if (!res.ok) throw new Error("Failed to fetch totals");
  return await res.json();
}

function Index() {
  const { isFetching, error, data } = useQuery({
    queryKey: ["expense-totals"],
    queryFn: fetchTotals,
  });

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription> The total amount spent on expenses</CardDescription>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-destructive">{error.message}</p>
        ) : (
          <p>{data?.expenses}</p>
        )}
      </CardContent>
    </Card>
  );
}
