import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { expenseSchema } from "@backend/schema/expense";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Calendar } from "@/components/ui/calendar";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      category: "",
      description: "",
      amount: "",
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const res = await api.expense.$post({ json: value });
      if (!res.ok) throw new Error("Failed to create expense");
      navigate({ to: "/expenses" });
    },
  });

  return (
    <div>
      <h2>Create Expense</h2>

      <form
        className="max-w-xl m-auto flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="category"
          validators={{ onChange: expenseSchema.shape.category }}
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
          validators={{ onChange: expenseSchema.shape.description }}
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
          validators={{ onChange: expenseSchema.shape.amount }}
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
          validators={{ onChange: expenseSchema.shape.date }}
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
