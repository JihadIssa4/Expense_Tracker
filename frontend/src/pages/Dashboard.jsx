import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { categoryIcons } from "../utils/icons";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [salary, setSalary] = useState(null);
  const [expensesByCategory, setExpensesByCategory] = useState({});
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salaryInput, setSalaryInput] = useState("");

  const navigate = useNavigate();

  const handleSubmitSalary = async () => {
    const endpoint = salary
      ? "/salary/updateSalary" // update
      : "/salary"; // create

    const method = salary ? "PUT" : "POST";

    await api.authRequest(endpoint, {
      method,
      body: JSON.stringify({ amount: Number(salaryInput) }),
    });

    fetchDashboardData(); // refresh
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [userRes, categoriesRes, salaryRes] = await Promise.all([
        api.authRequest("/user/profile"),
        api.authRequest("/categories/allCategories"),
        api.authRequest("/salary/current"),
      ]);
      if (![userRes, categoriesRes, salaryRes].every((r) => r.ok)) {
        throw new Error("Failed to load dashboard data");
      }
      const userData = await userRes.json();
      const categoriesData = await categoriesRes.json();
      const categoriesArray = categoriesData.categories;
      const salaryData = await salaryRes.json();

      setUser(userData);
      setCategories(categoriesArray);
      setSalary(salaryData.amount);
      const pairs = await Promise.all(
        categoriesArray.map(async (cat) => {
          const catExpenses = await api.getExpensesByCategory(cat.id);
          return [cat.id, catExpenses];
        })
      );
      const map = Object.fromEntries(pairs);
      setExpensesByCategory(map);
    } catch (err) {
      setError(err.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }
  if (salary == null) {
    return <div>No salary set yet</div>;
  }
  const allExpenses = Object.values(expensesByCategory).flat();
  const totalExpenses = allExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );
  const categoryMap = Object.fromEntries(
    categories.map((cat) => [cat.id, cat.name])
  );
  const getCategoryIcon = (categoryName) => categoryIcons[categoryName] || "📂";
  const expenses_percentage = (totalExpenses * 100) / salary;
  const remainingBudget = Number(salary) - totalExpenses;
  const remaining_percentage = (remainingBudget * 100) / salary;

  return (
    <main>
      <div>
        <Card className="flex justify-between items-center mb-6 text-[var(--text-primary)] font-bold text-[18px]">
          <div>
            <h2>{salary ? "Update Salary" : "Add Salary"}</h2>
          </div>
          <div className="flex justify-center items-center gap-3">
            <Input
              type="number"
              placeholder="Enter Salary"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
            ></Input>
            <Button className="text-[16px]" onClick={handleSubmitSalary}>
              {salary ? "Update Salary" : "Add Salary"}
            </Button>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 mb-8">
        <Card className="mb-[10px]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#94a3b8] text-[14px] font-bold">
              Total Salary
            </span>
            <div className="w-[40px] h-[40px] rounded-sm flex items-center justify-center bg-[rgba(16,185,129,0.1)] text-[#10b981]">
              💵
            </div>
          </div>
          <span className="text-4xl text-[#10b981] font-bold">${salary}</span>
          <span className="text-[14px] text-[#10b981] block mt-2">
            Monthly Income
          </span>
        </Card>
        <Card className="mb-[10px]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#94a3b8] text-[14px] font-bold">
              Total Expenses
            </span>
            <div className="w-[40px] h-[40px] rounded-sm flex items-center justify-center bg-[rgba(239,68,68,0.1)] text-[#ef4444]">
              💸
            </div>
          </div>
          <span className="text-4xl text-[#ef4444] font-bold">
            ${totalExpenses}
          </span>
          <span className="text-[14px] text-[#ef4444] block mt-2">
            {expenses_percentage}% of Salary
          </span>
        </Card>
        <Card className="mb-[10px]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#94a3b8] text-[14px] font-bold">
              Remaining Budget
            </span>
            <div className="w-[40px] h-[40px] rounded-sm flex items-center justify-center bg-[rgba(59,130,246,0.1)] text-[#10b981]">
              💰
            </div>
          </div>
          <span className="text-4xl text-[#3b82f6] font-bold">
            ${remainingBudget}
          </span>
          <span className="text-[14px] text-[#10b981] block mt-2">
            {remaining_percentage}% remaining
          </span>
        </Card>
        <Card className="mb-[10px]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#94a3b8] text-[14px] font-bold">
              Categories
            </span>
            <div className="w-[40px] h-[40px] rounded-sm flex items-center justify-center bg-[rgba(245,158,11,0.1)] text-[#10b981]">
              📁
            </div>
          </div>
          <span className="text-4xl text-[#f59e0b] font-bold">
            {categories.length}
          </span>
          <span className="text-[14px] text-[#10b981] block mt-2">
            Active budgets
          </span>
        </Card>
      </div>
      <Card>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[18px] text-[var(--text-primary)] font-bold">
            Recent Expenses
          </h2>
          <Button className="text-sm" onClick={() => navigate("/expenses")}>
            View All →
          </Button>
        </div>
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="text-[12px] text-[#94a3b8] border-b border-[var(--dark-border)]">
              <th className="py-2">Date</th>
              <th className="py-2">Category</th>
              <th className="py-2">Description</th>
              <th className="py-2">Amount</th>
            </tr>
          </thead>

          <tbody>
            {allExpenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-b border-[var(--dark-border)] hover:bg-[rgba(59,130,246,0.05)]"
              >
                <td className="py-4 text-[var(--text-primary)]">
                  {expense.date}
                </td>
                <td className="py-4 text-[var(--text-primary)]">
                  {categoryMap[expense.category_id]}
                </td>
                <td className="py-4 text-[var(--text-primary)]">
                  {expense.description}
                </td>
                <td className="py-4 text-[#ef4444] font-bold">
                  -{expense.amount}$
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="mt-8">
        <h2 className="text-[18px] mb-4 text-[var(--text-primary)] font-bold">
          Budget Overview
        </h2>
        {categories.map((cat) => {
          const rawPercent = (cat.actual_spent / cat.expected_amount) * 100;
          const percentUsed = Math.min(rawPercent, 100);
          const progressColor =
            rawPercent < 80
              ? "bg-green-500"
              : rawPercent <= 100
                ? "bg-yellow-500"
                : "bg-red-500";

          return (
            <Card className="mb-3" key={cat.id}>
              <div className="flex items-center mb-2">
                <span>{getCategoryIcon(cat.name)}</span>
                <span className="ml-2 text-[var(--text-primary)] text-xl font-bold">
                  {cat.name}
                </span>
              </div>

              <div className="text-sm text-[#94a3b8] mb-3">
                {cat.actual_spent} / {cat.expected_amount}
              </div>
              <div className="w-full mb-3 h-2 bg-[var(--dark-border)] rounded-full overflow-hidden">
                <div
                  className={`h-full ${progressColor} transition-all duration-300`}
                  style={{
                    width: `${percentUsed}%`,
                  }}
                />
              </div>
              <div className="text-[12px] text-[#94a3b8]">
                {percentUsed}% used {percentUsed > 100 ? "- Over Budget" : ""}
              </div>
            </Card>
          );
        })}
      </Card>
    </main>
  );
}
export default Dashboard;
