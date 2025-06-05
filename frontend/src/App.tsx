import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

function App() {
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    fetch("/api/expense/totals")
      .then((response) => response.json())
      .then((total) => setTotalExpenses(total.expenses));
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
