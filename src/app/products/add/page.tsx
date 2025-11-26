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
    tagline: "",
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

  const [banner, setBanner] = useState<File | null>(null); // ⭐ ADDED

  const [colors, setColors] = useState<string[]>(["#000000"]);

  const [colorImages, setColorImages] = useState<Record<string, File[]>>({
    "#000000": [undefined, undefined, undefined, undefined],
  });

  const [variantStock, setVariantStock] = useState<Record<string, number>>({
    "#000000": 0,
  });

  const categoryMap: Record<number, string> = {
    1: "watch",
    2: "earbud",
    3: "accessory",
  };

  const handleChange = (key: keyof Product, value: any) =>
    setProduct((prev) => ({ ...prev, [key]: value }));

  const handleColorImageSelect = (color: string, file: File, index: number) => {
    setColorImages((prev) => {
      const updated = { ...prev };
      const arr = [...updated[color]];
      arr[index] = file;
      updated[color] = arr;
      return updated;
    });
  };

  const handleColorsChange = (newColors: string[]) => {
    setColors(newColors);

    setColorImages((prev) => {
      const updated = { ...prev };

      newColors.forEach((color) => {
        if (!updated[color]) {
          updated[color] = [undefined, undefined, undefined, undefined];
        }
      });

      Object.keys(updated).forEach((color) => {
        if (!newColors.includes(color)) delete updated[color];
      });

      return updated;
    });

    setVariantStock((prev) => {
      const updated = { ...prev };
      newColors.forEach((color) => {
        if (!updated[color]) updated[color] = 0;
      });
      Object.keys(updated).forEach((c) => {
        if (!newColors.includes(c)) delete updated[c];
      });
      return updated;
    });
  };

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

  const handleAddProduct = async () => {
    try {
      setLoading(true);

      if (!banner) {
        alert("Please upload a banner image");
        setLoading(false);
        return;
      }

      if (!validateImages()) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token") || "";
      if (!token) throw new Error("No authorization token");

      const categoryString = categoryMap[product.categoryId || 0] || "";

      const formData = new FormData();

      formData.append("name", product.name || "");
      formData.append("tagline", product.tagline || "");
      formData.append("description", product.description || "");
      formData.append("price", String(product.price || 0));
      formData.append("category", categoryString);
      formData.append("stock", String(product.stockOnHand || 0));

      // ⭐ ADD BANNER FILE
      formData.append("banner", banner);

      // ⭐⭐⭐ FIX #1 — CLEAN COLOR KEYS FOR BACKEND
      const cleanedColors = colors.map((c) => c.replace("#", ""));

      // ⭐⭐⭐ FIX #2 — CLEAN STOCK KEYS
      const cleanedStock: Record<string, number> = {};
      Object.keys(variantStock).forEach((key) => {
        cleanedStock[key.replace("#", "")] = variantStock[key];
      });

      // ⭐ SEND CLEANED VALUES
      formData.append("colors", cleanedColors.join(","));
      formData.append("variantStock", JSON.stringify(cleanedStock));

      // ⭐ FIX #3 — SEND FILES USING CLEANED COLOR CODE
      colors.forEach((color) => {
        const safeColor = color.replace("#", "");
        const imgs = colorImages[color];

        imgs.forEach((file) => {
          if (file instanceof File) {
            formData.append(`colorImages_${safeColor}[]`, file);
          }
        });
      });

      const response = await createProduct(formData, token);
      console.log("Product created:", response);
      alert("Product created successfully!");

      setProduct({
        name: "",
        tagline: "",
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

      setBanner(null); // RESET BANNER

      setColors(["#000000"]);
      setColorImages({
        "#000000": [undefined, undefined, undefined, undefined],
      });
      setVariantStock({ "#000000": 0 });
    } catch (error: any) {
      console.error("Error:", error);
      alert("Error: " + error.message);
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
                <div className="space-y-5">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextBox
                      label="Product Name"
                      value={product.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />

                    <TextBox
                      label="Semi Heading"
                      value={product.tagline}
                      onChange={(e) => handleChange("tagline", e.target.value)}
                    />
                  </div>

                  <TextBox
                    label="SKU"
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
                      value={String(product.price)}
                      onChange={(e) =>
                        handleChange("price", Number(e.target.value))
                      }
                    />

                    <TextBox
                      label="Total Stock"
                      value={String(product.stockOnHand)}
                      onChange={(e) =>
                        handleChange("stockOnHand", Number(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium">
                      Category
                    </label>
                    <select
                      className="border px-3 py-2 rounded w-full"
                      value={product.categoryId}
                      onChange={(e) =>
                        handleChange("categoryId", Number(e.target.value))
                      }
                    >
                      <option value={0}>Select Category</option>
                      <option value={1}>Watch</option>
                      <option value={2}>Earbud</option>
                      <option value={3}>Accessories</option>
                    </select>
                  </div>

                  {/* ⭐ INSERT BANNER UPLOAD UNDER CATEGORY */}
                  <div className="mt-4 colors-black">
                    <label className="block text-sm mb-2 font-medium colors-black">
                      Banner Image
                    </label>

                    <UploadCard onFileSelect={(file) => setBanner(file!)} />

                    {banner && (
                      <p className="text-sm text-green-600 mt-1">
                        Selected: {banner.name}
                      </p>
                    )}
                  </div>

                </div>

                <div className="space-y-12">
                  {colors.map((color) => (
                    <div key={color}>
                      <h3 className="text-lg font-semibold mb-3 flex gap-2">
                        Images for:
                        <span
                          className="px-3 py-1 text-white text-xs rounded"
                          style={{ background: color }}
                        >
                          {color}
                        </span>
                      </h3>

                      <TextBox
                        label="Stock for this color"
                        value={String(variantStock[color])}
                        onChange={(e) =>
                          setVariantStock((prev) => ({
                            ...prev,
                            [color]: Number(e.target.value),
                          }))
                        }
                        className="mb-4"
                      />

                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {[0, 1, 2, 3].map((i) => (
                          <UploadCard
                            key={i}
                            onFileSelect={(file) =>
                              handleColorImageSelect(color, file!, i)
                            }
                          />
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <Button onClick={handleAddProduct} disabled={loading}>
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
