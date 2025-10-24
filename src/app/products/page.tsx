"use client";

import { useEffect, useState } from "react";
import RoleProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/layout/Sidebar";
import { searchProducts } from "../../services/productService";
import { searchProductImages } from "../../services/productImageService";
import { getAllProductCategories } from "../../services/ProductCategoryService";
import { Product } from "../../models/Product";
import { ProductImage } from "../../models/ProductImage";
import { ProductCategory } from "../../models/ProductCategory";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [imagesMap, setImagesMap] = useState<Record<number, ProductImage[]>>({});
  const [categoriesMap, setCategoriesMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchProductsAndImages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";

        // ✅ 1. Fetch categories and build a lookup map
        const categories = await getAllProductCategories(token);
        const categoryMap: Record<number, string> = {};
        categories.forEach((c: ProductCategory) => {
          categoryMap[c.id] = c.name;
        });
        setCategoriesMap(categoryMap);

        // ✅ 2. Fetch all products
        const filter: Partial<Product> = {
          createdAt: "2001-01-01T00:00:00Z",
          updatedAt: "2050-12-31T23:59:59Z",
        };
        const fetchedProducts = await searchProducts(filter, token);
        setProducts(fetchedProducts);

        // ✅ 3. For each product, fetch its images in parallel
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

        // ✅ 4. Create a map for quick access
        const map: Record<number, ProductImage[]> = {};
        imageResults.forEach((r) => {
          map[r.productId] = r.images;
        });
        setImagesMap(map);
      } catch (error) {
        console.error("❌ Error fetching products, images, or categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndImages();
  }, []);

  // ✅ Calculate paginated products
  const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);

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
              <>
                <ul className="divide-y divide-gray-200">
                  {paginatedProducts.map((p) => {
                    const imgs = imagesMap[p.id] || [];
                    const firstImage = imgs.length > 0 ? imgs[0].url : null;

                    const availableStock = p.stockOnHand - p.stockReserved;
                    const isInStock = availableStock > 0;
                    const categoryName = categoriesMap[p.categoryId] || "Uncategorized";

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
                              SKU: {p.sku} | {p.brand} | {categoryName}
                            </p>
                          </div>
                        </div>

                        {/* Price + Status */}
                        <div className="text-right space-y-1">
                          <p className="text-sm text-gray-700 font-semibold">
                            {p.price} PKR
                          </p>
                          <p
                            className={`text-sm font-semibold ${
                              p.isActive ? "text-green-600" : "text-red-500"
                            }`}
                          >
                            {p.isActive ? "Active" : "Inactive"}
                          </p>
                          <p
                            className={`text-sm font-semibold ${
                              isInStock ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {isInStock
                              ? `In Stock (${availableStock})`
                              : "Out of Stock"}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* ✅ Pagination Controls - improved typography */}
                <div className="flex justify-end items-center mt-8 gap-4">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                      page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow"
                    }`}
                  >
                    ← Previous
                  </button>

                  <span className="text-sm font-medium text-gray-700">
                    Page {page}
                  </span>

                  <button
                    disabled={paginatedProducts.length < pageSize}
                    onClick={() => setPage((p) => p + 1)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                      paginatedProducts.length < pageSize
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
