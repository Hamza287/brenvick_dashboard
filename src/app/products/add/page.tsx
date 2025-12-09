"use client";
import RoleProtectedRoute from "../../../components/ProtectedRoute";
import Sidebar from "../../../components/layout/Sidebar";
import ProductForm from "../../../components/ui/forms/product";
import { createProduct } from "../../../services/productService";

export default function AddProductPage() {
  const handleCreateProduct = async (formData: FormData) => {
    const token = localStorage.getItem("token") || "";
    if (!token) throw new Error("No authorization token");

    const response = await createProduct(formData, token);
    console.log("Product created:", response);
    alert("Product created successfully!");
  };

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="h-screen" />

        <main className="flex-1 p-8 flex flex-col">
          <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

          <div className="flex justify-center w-full">
            <ProductForm mode="create" onSubmit={handleCreateProduct} />
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
