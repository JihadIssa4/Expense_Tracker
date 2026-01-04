import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import CategoryModal from "../components/categories/CategoryModal";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategoriesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoriesRes = await api.authRequest("/categories/allCategories");
      if (!categoriesRes.ok) throw new Error("Failed to load categories");
      const categoriesData = await categoriesRes.json();
      console.log(categoriesData);
      setCategories(
        Array.isArray(categoriesData.categories)
          ? categoriesData.categories
          : []
      );
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this category? All related expenses may be affected."
    );

    if (!confirmed) return;

    try {
      const res = await api.authRequest(`/categories/delCategory/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete category");
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  if (loading) {
    return (
      <Card>
        <p className="text-[var(--text-secondary)]">Loading categories...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-500 mb-3">{error}</p>
        <Button onClick={fetchCategoriesData}>Retry</Button>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[var(--text-primary)] text-xl font-bold">
            Expense Categories
          </h2>
          <Button
            onClick={() => {
              setSelectedCategory(null);
              setIsModalOpen(true);
            }}
          >
            ➕ New Category
          </Button>
        </div>

        {categories.length === 0 ? (
          <p className="text-[var(--text-secondary)]">
            No categories yet. Create your first one.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const spent = category.actual_spent || 0;
              const expected = category.expected_amount || 0;
              const rawPercent = expected > 0 ? (spent / expected) * 100 : 0;
              const percent = Math.min(rawPercent, 100);

              let barColor = "bg-green-500";
              if (rawPercent >= 80 && rawPercent <= 100)
                barColor = "bg-orange-500";
              if (rawPercent > 100) barColor = "bg-red-500";

              return (
                <Card key={category.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {category.name}
                    </h3>

                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                        title="Edit"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    ${spent} / ${expected}
                  </p>

                  <div className="mt-3">
                    <div className="w-full h-2 bg-[var(--dark-border)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} transition-all`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1 text-right">
                      {Math.round(rawPercent)}%
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {isModalOpen && (
        <CategoryModal
          initialData={selectedCategory}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
          onSuccess={fetchCategoriesData}
        />
      )}
    </>
  );
}
export default Categories;
