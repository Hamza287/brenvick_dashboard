import { api } from "./api";
import { Order } from "../models/Order";

interface GetOrdersResponse {
  success: boolean;
  count: number;
  orders: Order[];
}

interface SingleOrderResponse {
  success: boolean;
  order: Order;
}

/**
 * ✅ Get all orders (Admin only)
 */
export const getOrders = async (): Promise<Order[]> => {
  const res = await api.get<GetOrdersResponse>("/orders");
  if (!res.data.success) throw new Error("Failed to fetch orders");
  return res.data.orders;
};

/**
 * ✅ Get order by ID
 */
export const getOrderById = async (id: string): Promise<Order> => {
  const res = await api.get<SingleOrderResponse>(`/orders/${id}`);
  if (!res.data.success) throw new Error("Failed to fetch order");
  return res.data.order;
};

/**
 * ✅ Create a new order
 */
export const createOrder = async (order: Partial<Order>): Promise<Order> => {
  const res = await api.post<SingleOrderResponse>("/orders", order);
  if (!res.data.success) throw new Error("Failed to create order");
  return res.data.order;
};

/**
 * ✅ Update an order
 */
export const updateOrder = async (id: string, order: Partial<Order>): Promise<Order> => {
  const res = await api.put<SingleOrderResponse>(`/orders/${id}`, order);
  if (!res.data.success) throw new Error("Failed to update order");
  return res.data.order;
};

/**
 * ✅ Delete an order
 */
export const deleteOrder = async (id: string): Promise<void> => {
  const res = await api.delete(`/orders/${id}`);
  if (!res.data.success) throw new Error("Failed to delete order");
};
