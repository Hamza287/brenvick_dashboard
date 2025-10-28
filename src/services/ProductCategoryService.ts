import { api } from "./api";
import { ProductCategory } from "../models/ProductCategory";
import { GenericResponse } from "../models/GenericResponse";

/**
 * ✅ Get all product categories
 */
export const getAllProductCategories = async (token: string): Promise<ProductCategory[]> => {
  const res = await api.get<GenericResponse<ProductCategory[]>>("/api/ProductCategory/GetAll", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Failed to fetch categories");

  return data.result;
};
