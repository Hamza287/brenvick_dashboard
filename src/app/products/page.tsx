"use client";

import { useEffect, useState } from "react";
import RoleProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/layout/Sidebar";
import { searchProducts } from "../../services/productService";
import { Product } from "../../models/Product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";

        // ✅ Search all products between 2001 and 2050
        const filter: Partial<Product> = {
          createdAt: "2001-01-01T00:00:00Z",
          updatedAt: "2050-12-31T23:59:59Z",
        };

        const result = await searchProducts(filter, token);
        setProducts(result);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <RoleProtectedRoute allowedRoles={[1]}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="h-screen" />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600 mt-2">
            Manage your product listings and inventory.
          </p>

          <div className="mt-6 bg-white rounded-2xl shadow p-6">
            {loading ? (
              <p className="text-gray-500">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-gray-500">
                No products found. Add new products to see them listed here.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {products.map((p) => (
                  <li key={p.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-sm text-gray-500">
                        SKU: {p.sku} | {p.brand} | {p.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {p.price} PKR
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          p.isActive ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </p>
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
