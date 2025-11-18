"use client";

import { useEffect, useState, useRef } from "react";
import RoleProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/layout/Sidebar";
import { getOrders } from "../../services/orderService";
import { Order } from "../../models/Order";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Store refs for each order card
  const orderRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // ✅ Stable ref setter (avoids mid-render re-creation)
  const setOrderRef = (id: string) => (el: HTMLDivElement | null) => {
    orderRefs.current[id] = el;
  };

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

  // ✅ Generate PDF for a specific order card

const generatePDF = async (order) => {
  try {
    const pdf = new jsPDF("p", "mm", "a4"); // portrait, millimeters, A4
    const marginLeft = 15;
    let y = 20;

    // 🧱 Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Order Summary", marginLeft, y);
    y += 10;

    // 🧾 Order Info
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(`Order ID: ${order.id}`, marginLeft, y);
    y += 7;
    pdf.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, marginLeft, y);
    y += 7;
    pdf.text(`Status: ${order.status}`, marginLeft, y);
    y += 10;

    // 🧍 Shipping Details
    pdf.setFont("helvetica", "bold");
    pdf.text("Shipping Information", marginLeft, y);
    y += 8;
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Recipient: ${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`,
      marginLeft,
      y
    );
    y += 6;
    pdf.text(
      `Address: ${order.shippingDetails.address}, ${order.shippingDetails.city}, ${order.shippingDetails.postalCode}, ${order.shippingDetails.country}`,
      marginLeft,
      y
    );
    y += 6;
    pdf.text(`Phone: ${order.shippingDetails.phone || "N/A"}`, marginLeft, y);
    y += 10;

    // 🛒 Items Header
    pdf.setFont("helvetica", "bold");
    pdf.text("Items", marginLeft, y);
    y += 8;
    pdf.setFont("helvetica", "normal");

    order.items.forEach((item, index) => {
      const subtotal = item.quantity * item.price;
      const line = `${index + 1}. ${item.name} | Qty: ${item.quantity} | Price: PKR ${item.price.toLocaleString()} | Subtotal: PKR ${subtotal.toLocaleString()}`;
      pdf.text(line, marginLeft, y);
      y += 6;

      // Page break if content exceeds page
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });

    y += 10;

    // 💰 Summary
    pdf.setFont("helvetica", "bold");
    pdf.text(
      `Total: PKR ${order.totalAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      marginLeft,
      y
    );
    y += 8;
    pdf.setFont("helvetica", "normal");
    pdf.text(`Payment Method: ${order.paymentMethod}`, marginLeft, y);

    // 🖼 Optional: include a snapshot of the order card
    const element = document.getElementById(`order-card-${order.id}`);
    if (element) {
      const canvas = await html2canvas(element, { scale: 1.5 });
      const imgData = canvas.toDataURL("image/png");
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    }

    // ✅ Save file
    pdf.save(`Order_${order.id}.pdf`);
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert("Something went wrong while generating the PDF.");
  }
};


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
                    ref={setOrderRef(order.id)}
                    className="border border-gray-200 rounded-2xl shadow-sm p-6 bg-gray-50 relative"
                  >
                    {/* PDF Button */}
                   <div className="flex justify-between items-center">
  <h2 className="font-semibold text-lg text-gray-800">
    Order ID: <span className="text-gray-700">{order.id}</span>
  </h2>
  <div className="flex flex-col items-end gap-2">
    <span className="text-sm text-gray-600">
      {new Date(order.createdAt).toLocaleString()}
    </span>
    <button
      onClick={() => generatePDF(order)}
      className="bg-red-700 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow"
    >
      Download PDF
    </button>
  </div>
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
