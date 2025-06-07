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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold"> Summary</h2>

      {isFetching ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-destructive">{error.message}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>The total number of expenses</CardDescription>
            </CardHeader>
            <CardContent>{data?.expenses}</CardContent>
          </Card>

          <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
              <CardTitle>Expenditure</CardTitle>
              <CardDescription>
                The total amount spent on expenses
              </CardDescription>
            </CardHeader>
            <CardContent>{data?.expenditure}</CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
