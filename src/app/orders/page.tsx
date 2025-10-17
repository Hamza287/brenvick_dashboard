"use client";

import { useEffect, useState } from "react";
import RoleProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/layout/Sidebar";
import { searchOrders } from "../../services/orderService";
import { Order } from "../../models/Order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (num: number, currency: string) => {
    if (Number.isFinite(num)) return `${num} ${currency || ""}`.trim();
    return `0 ${currency || ""}`.trim();
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";

        // ✅ Get all orders on the basis of created date since 2001
        // (and up to a safe upper bound so the API can interpret a range if supported)
        const filter: Partial<Order> = {
          createdAt: "2001-01-01T00:00:00Z",
          updatedAt: "2050-12-31T23:59:59Z",
        };

        const result = await searchOrders(filter, token);
        setOrders(result);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <RoleProtectedRoute allowedRoles={[1]}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="h-screen" />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer orders.</p>

          <div className="mt-6 bg-white rounded-2xl shadow p-6">
            {loading ? (
              <p className="text-gray-500">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-500">
                No orders found. Once customers place orders, they’ll appear here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left text-sm text-gray-700">
                      <th className="px-4 py-3 border-b">Order No</th>
                      <th className="px-4 py-3 border-b">Email</th>
                      <th className="px-4 py-3 border-b">Status</th>
                      <th className="px-4 py-3 border-b">Subtotal</th>
                      <th className="px-4 py-3 border-b">Discount</th>
                      <th className="px-4 py-3 border-b">Shipping</th>
                      <th className="px-4 py-3 border-b">Tax</th>
                      <th className="px-4 py-3 border-b">Grand Total</th>
                      <th className="px-4 py-3 border-b">Placed At</th>
                      <th className="px-4 py-3 border-b">Created</th>
                      <th className="px-4 py-3 border-b">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50 text-sm">
                        <td className="px-4 py-3 border-b font-medium">{o.orderNo}</td>
                        <td className="px-4 py-3 border-b">{o.email}</td>
                        <td className="px-4 py-3 border-b">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                              o.status === 0
                                ? "bg-yellow-100 text-yellow-700"
                                : o.status === 1
                                ? "bg-blue-100 text-blue-700"
                                : o.status === 2
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b">
                          {formatCurrency(o.subtotal, o.currency)}
                        </td>
                        <td className="px-4 py-3 border-b">
                          {formatCurrency(o.discountTotal, o.currency)}
                        </td>
                        <td className="px-4 py-3 border-b">
                          {formatCurrency(o.shippingTotal, o.currency)}
                        </td>
                        <td className="px-4 py-3 border-b">
                          {formatCurrency(o.taxTotal, o.currency)}
                        </td>
                        <td className="px-4 py-3 border-b font-semibold text-gray-900">
                          {formatCurrency(o.grandTotal, o.currency)}
                        </td>
                        <td className="px-4 py-3 border-b">{formatDate(o.placedAt)}</td>
                        <td className="px-4 py-3 border-b">{formatDate(o.createdAt)}</td>
                        <td className="px-4 py-3 border-b">{formatDate(o.updatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
