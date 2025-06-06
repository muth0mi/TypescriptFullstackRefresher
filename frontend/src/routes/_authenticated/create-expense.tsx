import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      category: "",
      description: "",
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      const res = await api.expense.$post({ json: value });
      if (!res.ok) throw new Error("Failed to create expense");
      navigate({ to: "/expenses" });
    },
  });

  return (
    <div className="p-2">
      <h2>Create Expense</h2>

      <form
        className="max-w-xl m-auto space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid w-full max-w-sm items-center gap-3">
          <form.Field
            name="category"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "Category is required"
                  : value.length < 3
                    ? "Category must be at least 3 characters"
                    : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return value.includes("error") && 'No "error" allowed';
              },
            }}
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Category</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <em>{field.state.meta.errors.join(", ")}</em>
                )}
                {field.state.meta.isValidating ? "Validating..." : null}
              </>
            )}
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "Description is required"
                  : value.length < 3
                    ? "Description must be at least 3 characters"
                    : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return value.includes("error") && 'No "error" allowed';
              },
            }}
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Description</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <em>{field.state.meta.errors.join(", ")}</em>
                )}
                {field.state.meta.isValidating ? "Validating..." : null}{" "}
              </>
            )}
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "Amount is required"
                  : value < 0
                    ? "Amount must be positive"
                    : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return !value && 'No "error" allowed';
              },
            }}
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Amount</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <em>{field.state.meta.errors.join(", ")}</em>
                )}
                {field.state.meta.isValidating ? "Validating..." : null}{" "}
              </>
            )}
          />
        </div>

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
