"use client";

import { useEffect, useState } from "react";
import RoleProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/layout/Sidebar";
import { getOrders } from "../../services/orderService";
import { Order } from "../../models/Order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="h-screen" />

        {/* Scrollable Orders List */}
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-700 mt-2">
            Manage and track all customer orders.
          </p>

          <div className="mt-6 bg-white rounded-2xl shadow p-6">
            {loading ? (
              <p className="text-gray-500">Loading orders...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <div className="flex flex-col space-y-8 overflow-y-auto max-h-[calc(100vh-180px)] pr-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-2xl shadow-sm p-6 bg-gray-50"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <h2 className="font-semibold text-lg text-gray-800">
                        Order ID:{" "}
                        <span className="text-gray-700">{order.id}</span>
                      </h2>
                      <span className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Shipping Info */}
                    <div className="mt-3 text-sm text-gray-700 bg-white p-4 rounded-xl border border-gray-200">
                      <p>
                        <strong>Recipient:</strong>{" "}
                        {order.shippingDetails.firstName}{" "}
                        {order.shippingDetails.lastName}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {order.shippingDetails.address},{" "}
                        {order.shippingDetails.city},{" "}
                        {order.shippingDetails.postalCode},{" "}
                        {order.shippingDetails.country}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {order.shippingDetails.phone || "N/A"}
                      </p>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-800">
                      <p>
                        <strong>Total:</strong> ₹{order.totalAmount}
                      </p>
                      <p>
                        <strong>Payment:</strong> {order.paymentMethod}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`font-semibold ${
                            order.status === "Pending"
                              ? "text-yellow-600"
                              : order.status === "Delivered"
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </p>
                      <p>
                        <strong>Updated:</strong>{" "}
                        {new Date(order.updatedAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Items */}
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 bg-white hover:shadow transition"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-700">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Subtotal:</strong> ₹
                              {item.quantity * item.price}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              <strong>Category:</strong>{" "}
                              {typeof item.product?.category === "string"
                                ? item.product.category
                                : "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              <strong>Colors:</strong>{" "}
                              {Array.isArray(item.product?.colors)
                                ? item.product.colors.join(", ")
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
