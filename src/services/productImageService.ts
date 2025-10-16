import { api } from "./api";
import { ProductImage } from "../models/ProductImage";
import { GenericResponse } from "../models/GenericResponse";

/**
 * ✅ Upload a product image
 * (multipart/form-data, requires file + productId)
 */
export const uploadProductImage = async (
  file: File,
  productId: number,
  token: string,
  altText?: string,
  position: number = 0
): Promise<ProductImage> => {
  const formData = new FormData();
  formData.append("Id", "0");
  formData.append("File", file);
  formData.append("ProductId", productId.toString());
  formData.append("Url", "https://localhost:44339/"); // matches backend signature
  formData.append("AltText", altText || file.name);
  formData.append("Position", position.toString());

  const res = await api.post<GenericResponse<ProductImage>>("/api/ProductImage", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Product image upload failed");

  return data.result;
};

/**
 * ✅ Fetch image by ID
 */
export const fetchProductImageById = async (id: number, token: string): Promise<ProductImage> => {
  const res = await api.get<GenericResponse<ProductImage>>(`/api/ProductImage/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Product image fetch failed");

  return data.result;
};

/**
 * ✅ Delete image by ID
 */
export const deleteProductImage = async (id: number, token: string): Promise<ProductImage> => {
  const res = await api.delete<GenericResponse<ProductImage>>(`/api/ProductImage/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Product image delete failed");

  return data.result;
};

/**
 * ✅ Search product images (by filter)
 */
export const searchProductImages = async (
  filter: Partial<ProductImage>,
  token: string
): Promise<ProductImage[]> => {
  const res = await api.post<GenericResponse<ProductImage[]>>("/api/ProductImage/search", filter, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Product image search failed");

  return data.result;
};
