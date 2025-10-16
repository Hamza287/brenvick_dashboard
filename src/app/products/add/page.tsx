"use client";

import { useState } from "react";
import RoleProtectedRoute from "../../../components/ProtectedRoute";
import Sidebar from "../../../components/layout/Sidebar";
import Card from "../../../components/ui/Card";
import TextBox from "../../../components/ui/TextBox";
import Button from "../../../components/ui/Button";
import { UploadCard } from "../../../components/ui/UploadCard";
import { createProduct } from "../../../services/productService";
import { uploadProductImage } from "../../../services/productImageService";
import { Product } from "../../../models/Product";

export default function AddProductPage() {
  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    sku: "",
    description: "",
    price: 0,
    compareAtPrice: 0,
    brand: "",
    category: "",
    attributes: {},
    stockOnHand: 0,
    stockReserved: 0,
    isActive: true,
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

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

      // ✅ Step 1: Create the product
      const createdProduct = await createProduct(product, token);
      console.log("✅ Product created:", createdProduct);

      // ✅ Step 2: Upload product images (1 by 1)
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        if (!file) continue;

        await uploadProductImage(file, createdProduct.id, token, file.name, i);
        console.log(`✅ Image ${i + 1} uploaded`);
      }

      alert("✅ Product and images uploaded successfully!");
      setProduct({
        name: "",
        sku: "",
        description: "",
        price: 0,
        compareAtPrice: 0,
        brand: "",
        category: "",
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
    <RoleProtectedRoute allowedRoles={[1]}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="h-screen" />

        {/* Main Content */}
        <main className="flex-1 p-8 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-red)] focus:border-[var(--brand-red)]"
              value={product.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Smart Watch">Smart Watch</option>
              <option value="Phone">Phone</option>
              <option value="Laptop">Laptop</option>
            </select>
          </div>

          {/* Centered Responsive Container */}
          <div className="flex justify-center w-full">
            <Card className="w-full max-w-[95%] xl:max-w-[1400px] p-10">
              <h2 className="text-xl font-semibold mb-8 text-gray-800">
                General Information
              </h2>

              {/* Two-column layout inside card */}
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-12">
                {/* LEFT SIDE — Form */}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextBox
                      label="Product Name"
                      placeholder="Enter product name"
                      value={product.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                    <TextBox
                      label="SKU"
                      placeholder="Enter SKU"
                      value={product.sku}
                      onChange={(e) => handleChange("sku", e.target.value)}
                    />
                  </div>

                  <TextBox
                    label="Description"
                    placeholder="Enter description"
                    textarea
                    rows={4}
                    value={product.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextBox
                      label="Base Pricing"
                      placeholder="e.g. 789.00 PKR"
                      value={product.price?.toString() || ""}
                      onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                    />
                    <TextBox
                      label="Stock"
                      placeholder="e.g. 77"
                      value={product.stockOnHand?.toString() || ""}
                      onChange={(e) => handleChange("stockOnHand", parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <TextBox
                    label="Brand"
                    placeholder="Enter brand name"
                    value={product.brand}
                    onChange={(e) => handleChange("brand", e.target.value)}
                  />
                </div>

                {/* RIGHT SIDE — Image Upload Section */}
                <div className="flex flex-col justify-start">
                  <label className="text-sm font-medium text-gray-700 mb-3">
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

                  <p className="text-xs text-gray-500 mt-3 leading-snug">
                    The image format should be <b>jpg/jpeg/png</b>. <br />
                    Minimum size: <b>300×300px</b>. Recommended: <b>700×700px</b>.
                  </p>
                </div>
              </div>

              {/* Add Product Button */}
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
