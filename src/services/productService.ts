import { api } from "./api";
import { Product } from "../models/Product";
import { GenericResponse } from "../models/GenericResponse";

/**
 * ✅ Create product
 */
export const createProduct = async (product: Partial<Product>, token: string): Promise<Product> => {
  const res = await api.post<GenericResponse<Product>>("/api/Product", product, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Product creation failed");

  return data.result;
};

/**
 * ✅ Read product by ID
 */
export const fetchProductById = async (id: number, token: string): Promise<Product> => {
  const res = await api.get<GenericResponse<Product>>(`/api/Product/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Product fetch failed");

  return data.result;
};

/**
 * ✅ Update product
 */
export const updateProduct = async (product: Partial<Product>, token: string): Promise<Product> => {
  const res = await api.put<GenericResponse<Product>>("/api/Product", product, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Product update failed");

  return data.result;
};

/**
 * ✅ Delete product
 */
export const deleteProduct = async (id: number, token: string): Promise<Product> => {
  const res = await api.delete<GenericResponse<Product>>(`/api/Product/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Product delete failed");

  return data.result;
};

/**
 * ✅ Search products
 */
export const searchProducts = async (filter: Partial<Product>, token: string): Promise<Product[]> => {
  const res = await api.post<GenericResponse<Product[]>>("/api/Product/search", filter, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Product search failed");

  return data.result;
};
