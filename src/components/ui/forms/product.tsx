"use client";
import { useState, useEffect } from "react";

import Card from "../Card";
import TextBox from "../TextBox";
import Button from "../Button";
import { UploadCard } from "../UploadCard";
import ColorPicker from "../colorpicker";
import { Product } from "../../../models/Product";

type ColorImagesMap = Record<string, (string | File | undefined)[]>;

const categoryMap: Record<number, string> = {
  1: "watch",
  2: "earbud",
  3: "accessory",
};

type ProductFormMode = "create" | "edit";

interface ProductFormProps {
  mode?: ProductFormMode;
  initialProduct?: Partial<Product>;
  initialColors?: string[];
  initialVariantStock?: Record<string, number>;
  initialColorImages?: ColorImagesMap;
  initialBanner?: File | string | null;
  /** called with prepared FormData + raw state (for create or update API) */
  onSubmit?: (
    formData: FormData,
    meta: {
      product: Partial<Product>;
      colors: string[];
      variantStock: Record<string, number>;
      colorImages: ColorImagesMap;
      banner: File;
    }
  ) => Promise<void> | void;
}

export default function ProductForm({
  mode = "create",
  initialProduct,
  initialColors,
  initialVariantStock,
  initialColorImages,
  initialBanner,
  onSubmit,
}: ProductFormProps) {
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
    comingSoon: false,
    ...initialProduct,
  });

  const [loading, setLoading] = useState(false);

  const [banner, setBanner] = useState<File | string | null>(
    initialBanner ?? initialProduct?.banner ?? null
  );

  const [colors, setColors] = useState<string[]>(initialColors ?? ["#000000"]);

  const [colorImages, setColorImages] = useState<ColorImagesMap>(
    initialColorImages ?? {
      "#000000": [undefined, undefined, undefined, undefined],
    }
  );

  const [variantStock, setVariantStock] = useState<Record<string, number>>(
    initialVariantStock ?? {
      "#000000": 0,
    }
  );

  // AUTO-CALCULATE TOTAL STOCK
  useEffect(() => {
    const total = Object.values(variantStock).reduce(
      (sum, n) => sum + Number(n || 0),
      0
    );
    setProduct((prev) => ({ ...prev, stockOnHand: total }));
  }, [variantStock]);

  const handleChange = (key: keyof Product, value: any) =>
    setProduct((prev) => ({ ...prev, [key]: value }));

  const handleColorImageSelect = (color: string, file: File, index: number) => {
    setColorImages((prev) => {
      const updated: ColorImagesMap = { ...prev };
      const arr = [
        ...(updated[color] ?? [undefined, undefined, undefined, undefined]),
      ];
      arr[index] = file;
      updated[color] = arr;
      return updated;
    });
  };

  const handleColorsChange = (newColors: string[]) => {
    setColors(newColors);

    setColorImages((prev) => {
      const updated: ColorImagesMap = { ...prev };

      // add missing colors
      newColors.forEach((color) => {
        if (!updated[color]) {
          updated[color] = [undefined, undefined, undefined, undefined];
        }
      });

      // remove removed colors
      Object.keys(updated).forEach((color) => {
        if (!newColors.includes(color)) delete updated[color];
      });

      return updated;
    });

    setVariantStock((prev) => {
      const updated: Record<string, number> = { ...prev };

      // add missing
      newColors.forEach((color) => {
        if (!updated[color]) updated[color] = 0;
      });

      // remove removed
      Object.keys(updated).forEach((c) => {
        if (!newColors.includes(c)) delete updated[c];
      });

      return updated;
    });
  };

  const validateImages = () => {
    for (const color of colors) {
      const imgs = colorImages[color] || [];

      // Must exist and be 4 items
      if (imgs.length !== 4) {
        alert(`Color ${color} must have exactly 4 images`);
        return false;
      }

      // Must not contain undefined
      if (imgs.some((img) => img === undefined || img === null)) {
        alert(`Color ${color} has missing images`);
        return false;
      }
    }

    return true;
  };

  const buildFormData = () => {
    if (!banner) {
      if (mode === "edit" && initialProduct?.banner) {
        // allow old banner to remain
      } else {
        throw new Error("Please upload a banner image");
      }
    }

    if (!validateImages()) {
      // validation already alerted
      throw new Error("Validation failed");
    }

    const categoryString = categoryMap[product.categoryId || 0] || "";
    const formData = new FormData();

    formData.append("name", product.name || "");
    formData.append("tagline", product.tagline || "");
    formData.append("description", product.description || "");
    formData.append("price", String(product.price || 0));
    formData.append("category", categoryString);
    formData.append("stock", String(product.stockOnHand || 0));
    formData.append("comingSoon", String(product.comingSoon || false));

    // BANNER
    if (banner instanceof File) {
      // user uploaded new banner
      formData.append("banner", banner);
    } else if (typeof banner === "string") {
      // keep old banner
      formData.append("existingBanner", banner);
    }

    // COLORS WITHOUT #
    const cleanedColors = colors.map((c) => c.replace("#", ""));
    formData.append("colors", cleanedColors.join(","));

    // STOCK PER VARIANT (CLEAN KEYS)
    const cleanedStock: Record<string, number> = {};
    Object.keys(variantStock).forEach((key) => {
      cleanedStock[key.replace("#", "")] = variantStock[key];
    });
    formData.append("variantStock", JSON.stringify(cleanedStock));

    // COLOR IMAGES PER VARIANT
    colors.forEach((color) => {
      const safeColor = color.replace("#", "");
      const imgs = colorImages[color] || [];

      imgs.forEach((file) => {
        if (file instanceof File) {
          formData.append(`colorImages_${safeColor}[]`, file);
        }
      });
    });

    return formData;
  };

  const resetForm = () => {
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
      comingSoon: false,
    });
    setBanner(null);
    setColors(["#000000"]);
    setColorImages({
      "#000000": [undefined, undefined, undefined, undefined],
    });
    setVariantStock({ "#000000": 0 });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = buildFormData();

      if (onSubmit) {
        await onSubmit(formData, {
          product,
          colors,
          variantStock,
          colorImages,
          banner: banner as File,
        });
      }

      if (mode === "create") {
        // only auto-reset on create
        resetForm();
      }
    } catch (error: any) {
      if (error?.message && error.message !== "Validation failed") {
        alert("Error: " + error.message);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[95%] xl:max-w-[1400px] p-10">
      <h2 className="text-xl font-semibold mb-8">General Information</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
        {/* LEFT SIDE — MAIN FIELDS */}
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
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <ColorPicker colors={colors} onChange={handleColorsChange} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextBox
              label="Base Pricing"
              value={String(product.price)}
              onChange={(e) => handleChange("price", Number(e.target.value))}
            />

            {/* AUTO CALCULATED, NOT EDITABLE */}
            <TextBox
              label="Total Stock"
              value={String(product.stockOnHand)}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* COMING SOON TOGGLE */}
          <div className="mt-4">
            <label className="flex items-center gap-3 text-sm font-medium text-black">
              <input
                type="checkbox"
                checked={product.comingSoon || false}
                onChange={(e) => handleChange("comingSoon", e.target.checked)}
                className="w-4 h-4"
              />
              Mark as Coming Soon
            </label>
          </div>

          <div>
            <label className="block text-black mb-2 font-medium">
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

          <div className="mt-4">
            <label className="block text-black mb-2 font-medium">
              Banner Image
            </label>

            <UploadCard
              value={banner} // ⭐ THIS IS THE FIX — pass the current banner
              onFileSelect={(file) => setBanner(file ?? null)}
            />

            {/* Show selected new file name */}
            {banner instanceof File && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {banner.name}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE — COLOR VARIANTS */}
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
                value={String(variantStock[color] ?? 0)}
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
                    value={colorImages[color]?.[i] ?? null}
                    onFileSelect={(file) =>
                      handleColorImageSelect(color, file, i)
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading
            ? mode === "create"
              ? "Adding..."
              : "Updating..."
            : mode === "create"
            ? "Add Product"
            : "Update Product"}
        </Button>
      </div>
    </Card>
  );
}
