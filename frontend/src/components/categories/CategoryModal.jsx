import { useState, useEffect } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { api } from "../../services/api";

function CategoryModal({ onClose, onSuccess, initialData = null }) {
  const isEdit = Boolean(initialData);

  const [name, setName] = useState("");
  const [expectedAmount, setExpectedAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setName(initialData.name);
      setExpectedAmount(initialData.expected_amount);
    }
  }, [isEdit, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    if (expectedAmount <= 0) {
      setError("Expected amount must be greater than zero");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isEdit
        ? `/categories/updateCategory/${initialData.id}`
        : "/categories/addCategory";

      const method = isEdit ? "PUT" : "POST";

      const res = await api.authRequest(endpoint, {
        method,
        body: JSON.stringify({
          name,
          expected_amount: Number(expectedAmount),
        }),
      });

      if (!res.ok) throw new Error("Operation failed");

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
          {isEdit ? "Edit Category" : "New Category"}
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="w-full p-2 rounded bg-[var(--dark-bg)] border border-[var(--dark-border)] text-[var(--text-primary)]"
          />

          <input
            type="number"
            value={expectedAmount}
            onChange={(e) => setExpectedAmount(e.target.value)}
            placeholder="Expected monthly amount"
            className="w-full p-2 rounded bg-[var(--dark-bg)] border border-[var(--dark-border)] text-[var(--text-primary)]"
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CategoryModal;
