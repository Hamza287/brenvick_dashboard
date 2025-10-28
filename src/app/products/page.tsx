"use client";

import { useEffect, useState } from "react";
import RoleProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/layout/Sidebar";
import { getAllProducts, deleteProduct } from "../../services/productService";
import { Product } from "../../models/Product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await getAllProducts();
        setProducts(result);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token") || "";
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id.toString(), token);
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
          <h1 className="text-2xl font-bold text-gray-800 mb-6">All Products</h1>

          <div className="bg-white rounded-2xl shadow p-6">
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : products.length === 0 ? (
              <p className="text-gray-500">No products found.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {products.map((p) => (
                  <li key={p.id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{p.name}</p>
                      <p className="text-sm text-gray-500">
                        {p.category} | {p.brand} | Stock: {p.stockOnHand}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 font-medium">{p.price} PKR</span>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 text-sm font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
