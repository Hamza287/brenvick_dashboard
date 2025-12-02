"use client";

import { useEffect, useState } from "react";
import RoleProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/layout/Sidebar";
import { getAllProducts, deleteProduct } from "../../services/productService";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({}); // Track dropdown state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // ⭐ getAllProducts() RETURNS AN ARRAY, NOT { products: [...] }
        const result = await getAllProducts();

        setProducts(result); // ← FIXED
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token") || "";
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Product deleted successfully");
    } catch (err: any) {
      alert(`❌ ${err.message || "Failed to delete product"}`);
    }
  };

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="h-screen" />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            All Products
          </h1>

          <div className="bg-white rounded-2xl shadow p-6">
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : products.length === 0 ? (
              <p className="text-gray-500">No products found.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {products.map((p) => {
                  // ⭐ Calculate total stock from all color variants
                  const totalStock =
                    p?.images?.reduce(
                      (sum: number, col: any) => sum + (col.stock || 0),
                      0
                    ) || 0;

                  return (
                    <li
                      key={p.id}
                      className="py-4 flex flex-col gap-2 transition"
                    >
                      {/* TOP ROW */}
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">{p.name}</p>

                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{p.category}</span>

                            {/* ⭐ STOCK TOGGLE BUTTON */}
                            <button
                              onClick={() =>
                                setExpanded((prev) => ({
                                  ...prev,
                                  [p.id]: !prev[p.id],
                                }))
                              }
                              className="flex items-center gap-1 font-medium text-gray-700"
                            >
                              Stock: {totalStock}
                              {expanded[p.id] ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Price + Delete */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-700 font-medium">
                            {p.price} PKR
                          </span>

                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-600 text-sm font-semibold hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* ⭐ Expandable STOCK AREA */}
                      {expanded[p.id] && (
                        <div className="mt-2 bg-gray-100 rounded-lg p-4 text-sm">
                          <p className="font-medium mb-2 text-gray-700">
                            Stock Per Color:
                          </p>

                          <div className="space-y-2">
                            {p.images?.map((c: any) => (
                              <div
                                key={c._id}
                                className="flex justify-between items-center bg-white rounded px-3 py-2 shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  {/* Color Circle */}
                                  <div
                                    className="w-5 h-5 rounded-full border"
                                    style={{
                                      backgroundColor: `#${c.color}`,
                                    }}
                                  ></div>

                                  <span className="text-gray-800 font-medium">
                                    #{c.color}
                                  </span>
                                </div>

                                <span className="font-semibold text-gray-900">
                                  {c.stock}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
