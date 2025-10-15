import { api } from "./api";
import { Order } from "../models/Order";
import { GenericResponse } from "../models/GenericResponse";

/**
 * ✅ Create order
 */
export const createOrder = async (order: Partial<Order>, token: string): Promise<Order> => {
  const res = await api.post<GenericResponse<Order>>("/api/Order", order, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Order creation failed");

  return data.result;
};

/**
 * ✅ Read order by ID
 */
export const fetchOrderById = async (id: number, token: string): Promise<Order> => {
  const res = await api.get<GenericResponse<Order>>(`/api/Order/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Order fetch failed");

  return data.result;
};

/**
 * ✅ Update order
 */
export const updateOrder = async (order: Partial<Order>, token: string): Promise<Order> => {
  const res = await api.put<GenericResponse<Order>>("/api/Order", order, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Order update failed");

  return data.result;
};

/**
 * ✅ Delete order
 */
export const deleteOrder = async (id: number, token: string): Promise<Order> => {
  const res = await api.delete<GenericResponse<Order>>(`/api/Order/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Order delete failed");

  return data.result;
};

/**
 * ✅ Search orders
 */
export const searchOrders = async (filter: Partial<Order>, token: string): Promise<Order[]> => {
  const res = await api.post<GenericResponse<Order[]>>("/api/Order/search", filter, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) throw new Error(JSON.stringify(data.errorList));
  if (!data.success || !data.result) throw new Error(data.message || "Order search failed");

  return data.result;
};
