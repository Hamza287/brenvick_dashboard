import { api } from "./api";
import { CartItem } from "../models/CartItem";
import { GenericResponse } from "../models/GenericResponse";

/**
 * ✅ Create cart item
 */
export const createCartItem = async (cartItem: Partial<CartItem>, token: string): Promise<CartItem> => {
  const res = await api.post<GenericResponse<CartItem>>("/api/CartItem", cartItem, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Cart item creation failed");

  return data.result;
};

/**
 * ✅ Read cart item by ID
 */
export const fetchCartItemById = async (id: number, token: string): Promise<CartItem> => {
  const res = await api.get<GenericResponse<CartItem>>(`/api/CartItem/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Cart item fetch failed");

  return data.result;
};

/**
 * ✅ Update cart item
 */
export const updateCartItem = async (cartItem: Partial<CartItem>, token: string): Promise<CartItem> => {
  const res = await api.put<GenericResponse<CartItem>>("/api/CartItem", cartItem, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Cart item update failed");

  return data.result;
};

/**
 * ✅ Delete cart item
 */
export const deleteCartItem = async (id: number, token: string): Promise<CartItem> => {
  const res = await api.delete<GenericResponse<CartItem>>(`/api/CartItem/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Cart item delete failed");

  return data.result;
};

/**
 * ✅ Search cart items
 */
export const searchCartItems = async (filter: Partial<CartItem>, token: string): Promise<CartItem[]> => {
  const res = await api.post<GenericResponse<CartItem[]>>("/api/CartItem/search", filter, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Cart item search failed");

  return data.result;
};
