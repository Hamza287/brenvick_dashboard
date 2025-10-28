"use client";

import { useState } from "react";
import RoleProtectedRoute from "../../../components/ProtectedRoute";
import Sidebar from "../../../components/layout/Sidebar";
import Card from "../../../components/ui/Card";
import TextBox from "../../../components/ui/TextBox";
import Button from "../../../components/ui/Button";
import { UploadCard } from "../../../components/ui/UploadCard";
import { createProduct } from "../../../services/productService";
import { Product } from "../../../models/Product";

export default function AddProductPage() {
  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    sku: "",
    description: "",
    price: 0,
    compareAtPrice: 0,
    brand: "",
    categoryId: 0,
    attributes: {},
    stockOnHand: 0,
    stockReserved: 0,
    isActive: true,
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // categoryId <-> category string mapping
  const categoryMap: Record<number, string> = {
    1: "watch",
    2: "earbud",
    3: "accessories",
  };

  const handleChange = (key: keyof Product, value: any) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileSelect = (file: File, index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  const handleAddProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      if (!token) throw new Error("No authorization token found");

      // ✅ Convert categoryId -> category string for backend
      const categoryString = categoryMap[product.categoryId || 0] || "";

      // ✅ prepare form-data for backend /api/products
      const formData = new FormData();
      formData.append("name", product.name || "");
      formData.append("description", product.description || "");
      formData.append("price", product.price?.toString() || "0");
      formData.append("category", categoryString); // backend expects category string
      formData.append("stock", product.stockOnHand?.toString() || "0");
      formData.append("colors", "black,silver,gold");

      // append images
      images.forEach((file) => {
        if (file) formData.append("images", file);
      });

      // ✅ call backend
      const response = await createProduct(formData, token);
      console.log("✅ Product created:", response);

      alert("✅ Product created successfully!");
      setProduct({
        name: "",
        sku: "",
        description: "",
        price: 0,
        compareAtPrice: 0,
        brand: "",
        categoryId: 0,
        attributes: {},
        stockOnHand: 0,
        stockReserved: 0,
        isActive: true,
      });
      setImages([]);
    } catch (error: any) {
      console.error("❌ Error:", error);
      alert(`❌ ${error.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="h-screen" />
        <main className="flex-1 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          </div>

          <div className="flex justify-center w-full">
            <Card className="w-full max-w-[95%] xl:max-w-[1400px] p-10">
              <h2 className="text-xl font-semibold mb-8 text-gray-900">
                General Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-12">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextBox
                      label="Product Name"
                      placeholder="Enter product name"
                      value={product.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="text-gray-900 placeholder:text-gray-700"
                    />
                    <TextBox
                      label="SKU"
                      placeholder="Enter SKU"
                      value={product.sku}
                      onChange={(e) => handleChange("sku", e.target.value)}
                      className="text-gray-900 placeholder:text-gray-700"
                    />
                  </div>

                  <TextBox
                    label="Description"
                    placeholder="Enter description"
                    textarea
                    rows={4}
                    value={product.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="text-gray-900 placeholder:text-gray-700"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextBox
                      label="Base Pricing"
                      placeholder="e.g. 789.00 PKR"
                      value={product.price?.toString() || ""}
                      onChange={(e) =>
                        handleChange("price", parseFloat(e.target.value) || 0)
                      }
                      className="text-gray-900 placeholder:text-gray-700"
                    />
                    <TextBox
                      label="Stock"
                      placeholder="e.g. 77"
                      value={product.stockOnHand?.toString() || ""}
                      onChange={(e) =>
                        handleChange(
                          "stockOnHand",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="text-gray-900 placeholder:text-gray-700"
                    />
                  </div>

                  {/* ✅ Category Dropdown - fully working */}
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Category
                    </label>
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-[var(--brand-red)] focus:border-[var(--brand-red)] text-gray-900 placeholder:text-gray-700"
                      value={product.categoryId}
                      onChange={(e) =>
                        handleChange("categoryId", parseInt(e.target.value))
                      }
                    >
                      <option value={0}>Select Category</option>
                      <option value={1}>Watch</option>
                      <option value={2}>Earbud</option>
                      <option value={3}>Accessories</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col justify-start">
                  <label className="text-sm font-medium text-gray-800 mb-3">
                    Product Images
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <UploadCard
                        key={index}
                        onFileSelect={(file) => handleFileSelect(file, index)}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-gray-700 mt-3 leading-snug">
                    The image format should be <b>jpg/jpeg/png</b>. <br />
                    Minimum size: <b>300×300px</b>. Recommended: <b>700×700px</b>.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <Button
                  className="px-8 py-3 text-base font-semibold w-full sm:w-auto"
                  onClick={handleAddProduct}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
