"use client";

import { useEffect, useState } from "react";
import RoleProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/layout/Sidebar";
import { searchProducts } from "../../services/productService";
import { searchProductImages } from "../../services/productImageService";
import { Product } from "../../models/Product";
import { ProductImage } from "../../models/ProductImage";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [imagesMap, setImagesMap] = useState<Record<number, ProductImage[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductsAndImages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";

        // ✅ 1. Fetch all products
        const filter: Partial<Product> = {
          createdAt: "2001-01-01T00:00:00Z",
          updatedAt: "2050-12-31T23:59:59Z",
        };

        const fetchedProducts = await searchProducts(filter, token);
        setProducts(fetchedProducts);

        // ✅ 2. For each product, fetch its images in parallel
        const imagePromises = fetchedProducts.map(async (p) => {
          try {
            const imgs = await searchProductImages({ productId: p.id }, token);
            return { productId: p.id, images: imgs };
          } catch (err) {
            console.error(`❌ Error fetching images for product ${p.id}`, err);
            return { productId: p.id, images: [] };
          }
        });

        const imageResults = await Promise.all(imagePromises);

        // ✅ 3. Create a map for quick access
        const map: Record<number, ProductImage[]> = {};
        imageResults.forEach((r) => {
          map[r.productId] = r.images;
        });

        setImagesMap(map);
      } catch (error) {
        console.error("❌ Error fetching products or images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndImages();
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
                {products.map((p) => {
                  const imgs = imagesMap[p.id] || [];
                  const firstImage = imgs.length > 0 ? imgs[0].url : null;

                  return (
                    <li
                      key={p.id}
                      className="py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        {/* Product Image */}
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={imgs[0].altText || p.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 text-gray-400 flex items-center justify-center rounded-lg border text-xs">
                            No Image
                          </div>
                        )}

                        {/* Product Info */}
                        <div>
                          <p className="font-medium text-gray-800">{p.name}</p>
                          <p className="text-sm text-gray-500">
                            SKU: {p.sku} | {p.brand} | {p.category}
                          </p>
                        </div>
                      </div>

                      {/* Price + Status */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{p.price} PKR</p>
                        <p
                          className={`text-sm font-semibold ${
                            p.isActive ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
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
