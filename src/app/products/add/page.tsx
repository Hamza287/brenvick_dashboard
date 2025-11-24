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
import ColorPicker from "../../../components/ui/colorpicker";

export default function AddProductPage() {
  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    tagline: "",    // ⭐ ADDED
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

  const [loading, setLoading] = useState(false);

  // ⭐ DEFAULT BLACK COLOR
  const [colors, setColors] = useState<string[]>(["#000000"]);

  // ⭐ STORE 4 FILES PER COLOR
  const [colorImages, setColorImages] = useState<Record<string, File[]>>({
    "#000000": [undefined, undefined, undefined, undefined],
  });

  const categoryMap: Record<number, string> = {
    1: "watch",
    2: "earbud",
    3: "accessory",
  };

  const handleChange = (key: keyof Product, value: any) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  // ⭐ SAVE FILES FOR EACH COLOR SLOT
  const handleColorImageSelect = (color: string, file: File, index: number) => {
    setColorImages((prev) => {
      const updated = { ...prev };
      const newSet = [...(updated[color] || [])];
      newSet[index] = file;
      updated[color] = newSet;
      return updated;
    });
  };

  // ⭐ ADD / REMOVE COLOR LOGIC
  const handleColorsChange = (newColors: string[]) => {
    const updated: Record<string, File[]> = {};

    newColors.forEach((color) => {
      updated[color] =
        colorImages[color] || [undefined, undefined, undefined, undefined];
    });

    setColors(newColors);
    setColorImages(updated);
  };

  // ⭐ VALIDATE FILES BEFORE SENDING
  const validateImages = () => {
    for (const color of colors) {
      const imgs = colorImages[color] || [];
      const uploaded = imgs.filter((f) => f instanceof File).length;

      if (uploaded !== 4) {
        alert(`Color ${color} must have exactly 4 images`);
        return false;
      }
    }
    return true;
  };

  // ⭐ CREATE PRODUCT FUNCTION
  const handleAddProduct = async () => {
    try {
      setLoading(true);

      // ❌ Stop if missing images
      if (!validateImages()) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token") || "";
      if (!token) throw new Error("No authorization token found");

      const categoryString = categoryMap[product.categoryId || 0] || "";

      const formData = new FormData();
      formData.append("name", product.name || "");
      formData.append("tagline", product.tagline || ""); // ⭐ ADDED
      formData.append("description", product.description || "");
      formData.append("price", product.price?.toString() || "0");
      formData.append("category", categoryString);
      formData.append("stock", product.stockOnHand?.toString() || "0");

      // ⭐ SEND COLORS
      formData.append("colors", colors.join(","));

      // ⭐ SEND EXACT 4 IMAGES PER COLOR
      colors.forEach((color) => {
        const imgs = colorImages[color] || [];
        const uploaded = imgs.filter((f) => f instanceof File).length;

        if (uploaded !== 4) return;

        imgs.forEach((file) => {
          formData.append(`colorImages_${color}[]`, file);
        });
      });

      const response = await createProduct(formData, token);
      console.log("Product created:", response);
      alert("Product created successfully!");

      // RESET FORM
      setProduct({
        name: "",
        tagline: "",   // ⭐ RESET
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

      setColors(["#000000"]);
      setColorImages({
        "#000000": [undefined, undefined, undefined, undefined],
      });
    } catch (error: any) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="h-screen" />

        <main className="flex-1 p-8 flex flex-col">
          <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

          <div className="flex justify-center w-full">
            <Card className="w-full max-w-[95%] xl:max-w-[1400px] p-10">
              <h2 className="text-xl font-semibold mb-8">
                General Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
                {/* LEFT SIDE */}
                <div className="space-y-5">
                  
                  {/* ⭐ NAME + TAGLINE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextBox
                      label="Product Name"
                      placeholder="Enter product name"
                      value={product.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />

                    {/* ⭐ NEW FIELD — SEMI HEADING */}
                    <TextBox
                      label="Semi Heading"
                      placeholder="Enter product tagline"
                      value={product.tagline}
                      onChange={(e) => handleChange("tagline", e.target.value)}
                    />
                  </div>

                  <TextBox
                    label="SKU"
                    placeholder="Enter SKU"
                    value={product.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                  />

                  <TextBox
                    label="Description"
                    textarea
                    rows={4}
                    value={product.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />

                  <ColorPicker colors={colors} onChange={handleColorsChange} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextBox
                      label="Base Pricing"
                      placeholder="e.g. 1200"
                      value={product.price?.toString() || ""}
                      onChange={(e) =>
                        handleChange("price", parseFloat(e.target.value))
                      }
                    />
                    <TextBox
                      label="Stock"
                      placeholder="e.g. 77"
                      value={product.stockOnHand?.toString() || ""}
                      onChange={(e) =>
                        handleChange("stockOnHand", parseInt(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium">
                      Category
                    </label>
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
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

                {/* RIGHT SIDE — IMAGES */}
                <div className="space-y-12">
                  {colors.map((color) => (
                    <div key={color}>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        Images for color:
                        <span
                          className="px-3 py-1 rounded text-white text-xs"
                          style={{ background: color }}
                        >
                          {color}
                        </span>
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        {[0, 1, 2, 3].map((index) => (
                          <UploadCard
                            key={index}
                            onFileSelect={(file) =>
                              handleColorImageSelect(color, file, index)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <Button
                  onClick={handleAddProduct}
                  disabled={loading}
                  className="px-8 py-3 text-base font-semibold"
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
