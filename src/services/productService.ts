import { api } from "./api";
import { Product } from "../models/Product";


export const createProduct = async (
  formData: FormData,
  token: string
): Promise<any> => {
  try {
    const res = await api.post("/products", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("❌ Product creation failed:", error);
    throw new Error(error.response?.data?.message || "Failed to create product");
  }
};


/**
 * ✅ Get all products (public)
 */
export const getAllProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products");
  const data = res.data;

  if (!data.success) throw new Error(data.message || "Failed to fetch products");
  return data.products;
};

/**
 * ✅ Get product by ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  const data = res.data;

  if (!data.success) throw new Error(data.message || "Product not found");
  return data.product;
};

/**
 * ✅ Delete product (admin only)
 */
export const deleteProduct = async (id: string, token: string): Promise<void> => {
  const res = await api.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if (!data.success) throw new Error(data.message || "Failed to delete product");
};
