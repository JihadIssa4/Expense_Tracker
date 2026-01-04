import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useEffect, useState } from "react";
import { api } from "../services/api";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
    description: "",
    date: "",
  });
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    date: "",
  });

  const fetchExpensesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesRes, expensesRes] = await Promise.all([
        api.authRequest("/categories/allCategories"),
        api.authRequest("/expenses/"),
      ]);
      if (!categoriesRes.ok) throw new Error("Failed to load categories");
      if (!expensesRes.ok) throw new Error("Failed to load expenses");

      const categoriesData = await categoriesRes.json();
      const expensesData = await expensesRes.json();

      setCategories(
        Array.isArray(categoriesData.categories)
          ? categoriesData.categories
          : []
      );
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesData();
  }, []);

  const filteredExpenses = expenses.filter((expense) => {
    // Search by description
    if (
      filters.search &&
      !expense.description?.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Filter by category
    if (
      filters.categoryId &&
      String(expense.category_id) !== String(filters.categoryId)
    ) {
      return false;
    }

    // Filter by date
    if (filters.date && expense.date !== filters.date) {
      return false;
    }

    return true;
  });

  const openAddModal = () => {
    setEditingExpense(null);
    setFormData({
      category_id: "",
      amount: "",
      description: "",
      date: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setFormData({
      category_id: expense.category_id,
      amount: expense.amount,
      description: expense.description,
      date: expense.date,
    });
    setIsModalOpen(true);
  };

  const addExpense = async (expenseData) => {
    try {
      const res = await api.authRequest("/expenses/addExpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_id: expenseData.category_id,
          amount: Number(expenseData.amount),
          description: expenseData.description,
          date: expenseData.date,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to add expense");
      }
      const data = await res.json();
      setExpenses((prev) => [data.expense, ...prev]);
      fetchExpensesData();
    } catch (err) {
      console.error(err);
      alert("Could not add expense");
    }
  };

  const handleEdit = async (expenseId, updatedData) => {
    try {
      const res = await api.authRequest(`/expenses/${expenseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_id: updatedData.category_id,
          amount: Number(updatedData.amount),
          description: updatedData.description,
          date: updatedData.date,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update expense");
      }

      // Update local state immutably
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === expenseId
            ? {
                ...expense,
                category_id: updatedData.category_id,
                amount: Number(updatedData.amount),
                description: updatedData.description,
                date: updatedData.date,
              }
            : expense
        )
      );
    } catch (err) {
      console.error(err);
      alert("Could not update expense");
    }
  };

  const handleDelete = async (expenseId) => {
    console.log(expenseId);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      const res = await api.authRequest(`/expenses/${expenseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete expense");
      }

      // Remove deleted expense from local state
      setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
    } catch (err) {
      console.error(err);
      alert("Could not delete expense");
    }
  };

  const handleSubmitExpense = async () => {
    if (!formData.category_id || !formData.amount || !formData.date) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editingExpense) {
        // EDIT
        await handleEdit(editingExpense.id, formData);
      } else {
        // ADD
        await addExpense(formData);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="text-[var(--text-secondary)]">Loading expenses...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-red-500">{error}</div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl text-[var(--text-primary)] font-bold">
            All Expenses
          </h2>
          <Button className="text-sm" onClick={openAddModal}>
            ➕Add Expense
          </Button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <Input
            className="text-sm"
            placeholder="🔍Search Description..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          ></Input>
          <select
            className="bg-[var(--dark-bg)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
            value={filters.categoryId}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, categoryId: e.target.value }))
            }
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <Input
            type="date"
            className="bg-[var(--dark-card)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)]"
            value={filters.date}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, date: e.target.value }))
            }
          ></Input>
        </div>
        <table className="table-auto w-full text-left">
          <thead className="text-[12px] text-[#94a3b8] border-b border-[var(--dark-border)]">
            <tr>
              <th className="py-2">Date</th>
              <th className="py-2">Category</th>
              <th className="py-2">Description</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-b border-[var(--dark-border)] hover:bg-[rgba(59,130,246,0.05)]"
              >
                <td className="py-4 text-[var(--text-primary)]">
                  {expense.date}
                </td>
                <td className="py-4 text-[var(--text-primary)]">
                  {expense.category_name}
                </td>
                <td className="py-4 text-[var(--text-primary)]">
                  {expense.description}
                </td>
                <td className="py-4 text-[#ef4444] font-bold">
                  ${Number(expense.amount).toFixed(2)}
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      title="Edit"
                      onClick={() => {
                        openEditModal(expense);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(expense.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredExpenses.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-[var(--text-secondary)]"
                >
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--dark-card)] w-full max-w-md rounded-xl p-6 border border-[var(--dark-border)]">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
              {editingExpense ? "Edit Expense" : "Add Expense"}
            </h3>

            {/* Category */}
            <select
              className="w-full mb-3 px-3 py-2 rounded-lg bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--dark-border)]"
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Amount */}
            <Input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />

            {/* Description */}
            <Input
              className="mt-3"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/* Date */}
            <Input
              className="mt-3"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>

              <Button onClick={handleSubmitExpense}>
                {editingExpense ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Expenses;
