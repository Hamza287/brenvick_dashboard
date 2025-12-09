"use client";

import { useEffect, useState } from "react";
import RoleProtectedRoute from "../../../../components/ProtectedRoute";
import Sidebar from "../../../../components/layout/Sidebar";
import ProductForm from "../../../../components/ui/forms/product";
import { Product } from "../../../../models/Product";
import { getProductById, updateProduct } from "../../../../services/productService";

type ColorStockMap = Record<string, number>;
type ColorImagesMap = Record<string, (string | File | undefined)[]>;

const categoryReverseMap: Record<string, number> = {
  watch: 1,
  earbud: 2,
  accessory: 3,
};

export default function EditProductPage(props: any) {
  const params = props.params; // 👈 FIX

  const [initialProduct, setInitialProduct] = useState<Partial<Product> | null>(null);
  const [initialColors, setInitialColors] = useState<string[]>([]);
  const [initialVariantStock, setInitialVariantStock] = useState<ColorStockMap>({});
  const [initialColorImages, setInitialColorImages] = useState<ColorImagesMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const product = await getProductById(params.id);

        setInitialProduct({
          id: product.id,
          name: product.name,
          tagline: product.tagline,
          sku: product.sku,
          description: product.description,
          price: product.price,
          categoryId: categoryReverseMap[product.categoryId] || 0,
          comingSoon: product.comingSoon,
          stockOnHand: product.stockOnHand || 0,
          isActive: product.isActive,
          banner: product.banner,
        });

        const colors =
          product.images?.map((img: any) => `#${img.color}`) ?? [];

        setInitialColors(colors);

        const stockMap: ColorStockMap = {};
        product.images?.forEach((variant: any) => {
          stockMap[`#${variant.color}`] = variant.stock;
        });
        setInitialVariantStock(stockMap);

        const imageMap: ColorImagesMap = {};
        product.images?.forEach((variant: any) => {
          const colorKey = `#${variant.color}`;
          imageMap[colorKey] = [
            variant.images[0],
            variant.images[1],
            variant.images[2],
            variant.images[3],
          ];
        });

        setInitialColorImages(imageMap);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleUpdateProduct = async (formData: FormData) => {
    const token = localStorage.getItem("token") || "";
    if (!token) throw new Error("No authorization token");

    const result = await updateProduct(params.id, formData, token);
    console.log("Product updated successfully:", result);
    alert("Product updated successfully!");
  };

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="h-screen" />

        <main className="flex-1 p-8 flex flex-col">
          <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

          <div className="flex justify-center w-full">
            {loading || !initialProduct ? (
              <div className="bg-white rounded-2xl shadow p-8 w-full max-w-[95%] xl:max-w-[1400px] text-center text-gray-500">
                Loading product...
              </div>
            ) : (
              <ProductForm
                mode="edit"
                initialProduct={initialProduct}
                initialColors={initialColors}
                initialVariantStock={initialVariantStock}
                initialColorImages={initialColorImages}
                initialBanner={initialProduct.banner || null}
                onSubmit={handleUpdateProduct}
              />
            )}
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
