import { api } from "./api";
import { Cart } from "../models/Cart";
import { GenericResponse } from "../models/GenericResponse";

/**
 * ✅ Create cart
 */
export const createCart = async (cart: Partial<Cart>, token: string): Promise<Cart> => {
  const res = await api.post<GenericResponse<Cart>>("/api/Cart", cart, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Cart creation failed");

  return data.result;
};

/**
 * ✅ Read cart by ID
 */
export const fetchCartById = async (id: string, token: string): Promise<Cart> => {
  const res = await api.get<GenericResponse<Cart>>(`/api/Cart/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Cart fetch failed");

  return data.result;
};

/**
 * ✅ Update cart
 */
export const updateCart = async (cart: Partial<Cart>, token: string): Promise<Cart> => {
  const res = await api.put<GenericResponse<Cart>>("/api/Cart", cart, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Cart update failed");

  return data.result;
};

/**
 * ✅ Delete cart
 */
export const deleteCart = async (id: string, token: string): Promise<Cart> => {
  const res = await api.delete<GenericResponse<Cart>>(`/api/Cart/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Cart delete failed");

  return data.result;
};

/**
 * ✅ Search carts
 */
export const searchCarts = async (filter: Partial<Cart>, token: string): Promise<Cart[]> => {
  const res = await api.post<GenericResponse<Cart[]>>("/api/Cart/search", filter, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Cart search failed");

  return data.result;
};
