import { Button } from "@/components/ui/button";
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
import { expensesQueryOptions, deleteExpense } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader, Trash } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

function Expenses() {
  const queryClient = useQueryClient();
  const { isFetching, error, data } = useQuery(expensesQueryOptions);
  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: (error) => {
      toast.error("Failed to delete expense", { description: error.message });
    },
    onSuccess: (_, variables) => {
      toast.success("Expense deleted successfully");
      queryClient.setQueryData(expensesQueryOptions.queryKey, (prev) =>
        prev!.filter((expense) => expense.id !== variables),
      );
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold"> Expenses</h2>

      <Table className="w-full">
        <TableCaption>A list of your expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
                  <TableCell>
                    <Skeleton className="h-4" />
                  </TableCell>
                </TableRow>
              ))
          ) : error ? (
            <TableRow>
              <TableCell colSpan={4} className="text-destructive">
                {error.message}
              </TableCell>
            </TableRow>
          ) : (
            data?.map((expense, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{expense.title}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell className="text-right">{expense.amount}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      mutation.variables === expense.id && mutation.isPending
                    }
                    onClick={() => mutation.mutate(expense.id)}
                  >
                    {mutation.variables === expense.id && mutation.isPending ? (
                      <Loader className="h-4 w-4" />
                    ) : (
                      <Trash className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
