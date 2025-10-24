"use client";

import { useEffect, useState } from "react";
import RoleProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/layout/Sidebar";
import { searchOrders } from "../../services/orderService";
import { searchOrderItems } from "../../services/orderItemService";
import { searchShipments, updateShipment } from "../../services/shipmentService";
import { Order } from "../../models/Order";
import { OrderItem } from "../../models/OrderItem";
import { Shipment } from "../../models/Shipment";
import { ShipmentStatus } from "../../models/Enums";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItemsMap, setOrderItemsMap] = useState<Record<number, OrderItem[]>>({});
  const [shipmentMap, setShipmentMap] = useState<Record<number, Shipment | null>>({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  // ✅ Helpers
  const formatCurrency = (num: number, currency: string) => {
    if (Number.isFinite(num)) return `${num.toFixed(2)} ${currency || ""}`.trim();
    return `0.00 ${currency || ""}`.trim();
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  // ✅ Fetch all data
  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      // ✅ Step 1: Get all orders in current page
      const filter: Partial<Order> = {
        createdAt: "2001-01-01T00:00:00Z",
        updatedAt: "2050-12-31T23:59:59Z",
      };
      const allOrders = await searchOrders(filter, token);
      const pagedOrders = allOrders.slice((page - 1) * pageSize, page * pageSize);
      setOrders(pagedOrders);

      // ✅ Step 2: Fetch all order items for the current page
      const itemResults = await Promise.all(
        pagedOrders.map(async (order) => {
          try {
            const items = await searchOrderItems({ orderId: order.id }, token);
            return { orderId: order.id, items };
          } catch {
            return { orderId: order.id, items: [] };
          }
        })
      );

      const itemMap: Record<number, OrderItem[]> = {};
      itemResults.forEach((r) => (itemMap[r.orderId] = r.items));
      setOrderItemsMap(itemMap);

      // ✅ Step 3: Fetch shipment for each order *based on orderId*
      const shipmentResults = await Promise.all(
        pagedOrders.map(async (order) => {
          try {
            const shipments = await searchShipments({ orderId: order.id }, token);

            // ⚙️ Optional: pick the latest shipment if multiple exist
            const shipment =
              shipments && shipments.length > 0
                ? shipments.sort(
                    (a, b) =>
                      new Date(b.shippedAt || "").getTime() -
                      new Date(a.shippedAt || "").getTime()
                  )[0]
                : null;

            return { orderId: order.id, shipment };
          } catch (err) {
            console.warn(`⚠️ Failed to fetch shipment for order ${order.id}`, err);
            return { orderId: order.id, shipment: null };
          }
        })
      );

      const shipmentMapLocal: Record<number, Shipment | null> = {};
      shipmentResults.forEach((r) => (shipmentMapLocal[r.orderId] = r.shipment));
      setShipmentMap(shipmentMapLocal);
    } catch (err) {
      console.error("❌ Error fetching orders data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [page, token]);


  const handleShipmentStatusChange = async (orderId: number, newStatus: ShipmentStatus) => {
    const shipment = shipmentMap[orderId];
    if (!shipment) return;
    try {
      const updated = await updateShipment({ ...shipment, status: newStatus }, token);
      setShipmentMap((prev) => ({ ...prev, [orderId]: updated }));
    } catch (error) {
      console.error("❌ Failed to update shipment:", error);
    }
  };

  return (
    <RoleProtectedRoute allowedRoles={[1]}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="h-screen" />

        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer orders.</p>

          <div className="mt-6 bg-white rounded-2xl shadow p-6">
            {loading ? (
              <p className="text-gray-500">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <>
                <ul className="divide-y divide-gray-200">
                  {orders.map((o) => {
                    const items = orderItemsMap[o.id] || [];
                    const shipment = shipmentMap[o.id];

                    return (
                      <li
                        key={o.id}
                        className="py-4 flex items-start justify-between"
                      >
                        {/* Left Section */}
                        <div className="flex flex-col space-y-1">
                          <p className="font-medium text-gray-800">
                            Order #{o.orderNo}
                          </p>
                          <p className="text-sm text-gray-500">
                            {o.email}
                          </p>
                          <div className="text-sm text-gray-600 mt-1">
                            {items.length > 0
                              ? items.map((it) => (
                                  <div key={it.id}>
                                    {it.name} × {it.quantity}
                                  </div>
                                ))
                              : "No items"}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            Created: {formatDate(o.createdAt)}
                          </p>
                        </div>

                        {/* Right Section */}
                        <div className="text-right space-y-1">
                          <p className="text-sm text-gray-600">
                            {formatCurrency(o.grandTotal, o.currency)}
                          </p>
                          <div>
                            {shipment ? (
                              <select
                                className="border rounded-lg text-sm px-2 py-1"
                                value={shipment.status}
                                onChange={(e) =>
                                  handleShipmentStatusChange(
                                    o.id,
                                    Number(e.target.value)
                                  )
                                }
                              >
                                {Object.entries(ShipmentStatus)
                                  .filter(([k]) => isNaN(Number(k)))
                                  .map(([key, val]) => (
                                    <option key={val} value={val}>
                                      {key}
                                    </option>
                                  ))}
                              </select>
                            ) : (
                              <p className="text-xs text-gray-500">
                                No Shipment
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Pagination */}
                <div className="flex justify-end items-center mt-6 gap-3">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">Page {page}</span>
                  <button
                    disabled={orders.length < pageSize}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
