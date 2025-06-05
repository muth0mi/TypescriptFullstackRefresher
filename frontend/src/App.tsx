import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

function App() {
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    async function fetchTotal() {
      const res = await api.expense["totals"].$get();
      const total = await res.json();
      setTotalExpenses(total.expenses);
    }
    fetchTotal();
  }, []);

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription> The total amount spent on expenses</CardDescription>
      </CardHeader>
      <CardContent>{totalExpenses}</CardContent>
    </Card>
  );
}

export default App;
