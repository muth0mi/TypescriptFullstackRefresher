import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createExpense, expensesQueryOptions } from "@/lib/api";
import { expenseSchema } from "@app/shared";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm({
    validators: { onChange: expenseSchema.omit({ id: true }) },
    defaultValues: {
      category: "",
      description: "",
      amount: "",
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      await queryClient.ensureQueryData(expensesQueryOptions);
      try {
        const expense = await createExpense(value);
        queryClient.setQueryData(expensesQueryOptions.queryKey, (prev) => [
          ...(prev ?? []),
          expense,
        ]);
        toast.success("Created expense");
        navigate({ to: "/expenses" });
      } catch (e) {
        if (e instanceof Error) {
          toast.error("Failed to create expense", { description: e?.message });
        }
      }
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Create Expense</h2>

      <form
        className="flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="category"
          children={(field) => (
            <div className="grid gap-3">
              <Label htmlFor={field.name}>Category</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors && (
                <em>
                  {field.state.meta.errors.map((e) => e?.message).join(", ")}
                </em>
              )}
            </div>
          )}
        />

        <form.Field
          name="description"
          children={(field) => (
            <div className="grid gap-3">
              <Label htmlFor={field.name}>Description</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors && (
                <em>
                  {field.state.meta.errors.map((e) => e?.message).join(", ")}
                </em>
              )}
            </div>
          )}
        />

        <form.Field
          name="amount"
          children={(field) => (
            <div className="grid gap-3">
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors && (
                <em>
                  {field.state.meta.errors.map((e) => e?.message).join(", ")}
                </em>
              )}
            </div>
          )}
        />

        <form.Field
          name="date"
          children={(field) => (
            <div className="grid gap-3">
              <Label htmlFor={field.name}>Date</Label>
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date) =>
                  field.handleChange((date ?? new Date()).toISOString())
                }
                className="rounded-md border shadow-sm"
              />
              {field.state.meta.errors && (
                <em>
                  {field.state.meta.errors.map((e) => e?.message).join(", ")}
                </em>
              )}
            </div>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Create Expense"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
