import { api } from "./api";
import { OrderItem } from "../models/OrderItem";
import { GenericResponse } from "../models/GenericResponse";

/**
 * ✅ Create order item
 */
export const createOrderItem = async (orderItem: Partial<OrderItem>, token: string): Promise<OrderItem> => {
  const res = await api.post<GenericResponse<OrderItem>>("/api/OrderItem", orderItem, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Order item creation failed");

  return data.result;
};

/**
 * ✅ Read order item by ID
 */
export const fetchOrderItemById = async (id: number, token: string): Promise<OrderItem> => {
  const res = await api.get<GenericResponse<OrderItem>>(`/api/OrderItem/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Order item fetch failed");

  return data.result;
};

/**
 * ✅ Update order item
 */
export const updateOrderItem = async (orderItem: Partial<OrderItem>, token: string): Promise<OrderItem> => {
  const res = await api.put<GenericResponse<OrderItem>>("/api/OrderItem", orderItem, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Order item update failed");

  return data.result;
};

/**
 * ✅ Delete order item
 */
export const deleteOrderItem = async (id: number, token: string): Promise<OrderItem> => {
  const res = await api.delete<GenericResponse<OrderItem>>(`/api/OrderItem/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Order item delete failed");

  return data.result;
};

/**
 * ✅ Search order items
 */
export const searchOrderItems = async (filter: Partial<OrderItem>, token: string): Promise<OrderItem[]> => {
  const res = await api.post<GenericResponse<OrderItem[]>>("/api/OrderItem/search", filter, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Order item search failed");

  return data.result;
};
