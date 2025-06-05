import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});

async function fetchExpenses() {
  const res = await api.expense.$get();
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return await res.json();
}

function Expenses() {
  const { isFetching, error, data } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });

  return (
    <Table className="p-2 max-w-3xl m-auto">
      <TableCaption>A list of your expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      {isFetching ? (
        Array(3)
          .fill(0)
          .map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4" />
              </TableCell>
            </TableRow>
          ))
      ) : error ? (
        <p className="text-destructive">{error.message}</p>
      ) : (
        <TableBody>
          {data.map((expense, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell className="text-right">{expense.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}
