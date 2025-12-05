"use client";

import { useEffect, useState } from "react";
import RoleProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/layout/Sidebar";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import { Order } from "../../models/Order";
import jsPDF from "jspdf";
import PDFPreviewModal from "./PDFPreviewModal";
import namer from "color-namer";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // For Updating Status
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateSort, setDateSort] = useState("Newest");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getOrders();
        setOrders(response);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* ========================================================================================
     VARIANT PARSER
  ======================================================================================== */
  const parseVariant = (
    imageField: any
  ): { color: string; image: string | null } => {
    try {
      if (!imageField) return { color: "000000", image: null };
      let parsed = typeof imageField === "string" ? JSON.parse(imageField) : imageField;

      return {
        color: parsed.color || "000000",
        image: parsed.images?.[0] || null,
      };
    } catch (err) {
      console.error("Variant parsing failed:", imageField, err);
      return { color: "000000", image: null };
    }
  };

  /* ========================================================================================
     UPDATE ORDER STATUS
  ======================================================================================== */
  const statusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600";
      case "Shipped":
        return "text-blue-600";
      case "Delivered":
        return "text-green-600";
      case "Returned":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleStatusSave = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      setEditingId(null);
      alert("Order status updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };
  const toBase64 = (url: string): Promise<string> =>
  fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        })
    );
  /* ========================================================================================
     PDF GENERATOR
  ======================================================================================== */
  const previewPDF = async (order: Order) => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");

    // ⭐ Convert your public logo to Base64
    const logoBase64 = await toBase64("/brenvickPDF.png"); 
    // If PNG → use "/brenLogo.png"

    /* ------------------------------------------------------
       ADD LOGO IN TOP RIGHT
    ------------------------------------------------------ */
    pdf.addImage(logoBase64, "PNG", 160, 10, 30, 15);

    let y = 20;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Order Summary", 15, y);
    y += 10;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    pdf.text(`Order ID: ${order.id}`, 15, y);
    y += 4;

    pdf.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 15, y);
    y += 8;

    // Shipping Info
    pdf.setFont("helvetica", "bold");
    pdf.text("Shipping Information", 15, y);
    y += 6;

    pdf.setFont("helvetica", "normal");

    pdf.text(
      `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`,
      15,
      y
    );
    y += 4;

    pdf.text(
      `${order.shippingDetails.address}, ${order.shippingDetails.city}, ${order.shippingDetails.country}`,
      15,
      y
    );
    y += 4;

    pdf.text(`Phone: ${order.shippingDetails.phone}`, 15, y);
    y += 8;

    // Items
    pdf.setFont("helvetica", "bold");
    pdf.text("Items", 15, y);
    y += 6;

    pdf.setFont("helvetica", "normal");

    order.items.forEach((item, index) => {
      const { color: variantColor } = parseVariant(item.image);

      let colorName = "";
      try {
        colorName = namer(`#${variantColor}`).basic[0].name;
      } catch {
        colorName = "Unknown";
      }

      pdf.text(`${index + 1}. ${item.name}`, 15, y);
      y += 4;

      pdf.text(`Qty: ${item.quantity}`, 15, y);
      y += 4;

      pdf.text(`Price: PKR ${item.price}`, 15, y);
      y += 4;

      pdf.text(`Color: ${colorName} (${variantColor})`, 15, y);
      y += 6;

      if (y > 260) {
        pdf.addPage();
        y = 20;
      }
    });

    y += 6;
    pdf.setFont("helvetica", "bold");
    pdf.text(`Total Amount: PKR ${order.totalAmount}`, 15, y);

    const blobUrl = pdf.output("bloburl").toString();
    setPdfUrl(blobUrl);
    setShowPreview(true);
  } catch (err) {
    console.error(err);
    alert("Failed to generate PDF preview");
  }
};




  /* ========================================================================================
     FILTERED + SORTED ORDERS
  ======================================================================================== */
  const filteredOrders = orders
    .filter((order) => {
      if (statusFilter === "All") return true;
      return order.status === statusFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateSort === "Newest" ? dateB - dateA : dateA - dateB;
    });

  /* ========================================================================================
     RENDER UI
  ======================================================================================== */
  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-2xl font-bold">Orders</h1>

          {/* FILTER BAR */}
          <div className="mt-4 flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow border">

            {/* Status Filter */}
            <div>
              <label className="font-semibold mr-2 text-[#CD001A]">Filter by Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border px-3 py-2 rounded-md"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
              </select>
            </div>

            {/* Date Sort */}
            <div>
              <label className="font-semibold mr-2 text-[#CD001A]">Sort by Date:</label>
              <select
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value)}
                className="border px-3 py-2 rounded-md"
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* LOADING / ERROR */}
          {loading ? (
            <p className="mt-6">Loading...</p>
          ) : error ? (
            <p className="mt-6 text-red-500">{error}</p>
          ) : (
            <div className="mt-6 space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-xl shadow border text-black"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center flex-wrap">
                    <div>
                      <h2 className="font-semibold text-lg">
                        Order ID: {order.id}
                      </h2>

                      <p className="text-sm mt-1">
                        Date: {new Date(order.createdAt).toLocaleString()}
                      </p>

                      {/* STATUS SECTION */}
                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                        <span className="font-semibold">Status:</span>

                        {editingId === order.id ? (
                          <>
                            <select
                              className="border px-2 py-1 rounded"
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Returned">Returned</option>
                            </select>

                            <button
                              onClick={() => handleStatusSave(order.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded"
                            >
                              Save
                            </button>

                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 bg-gray-400 text-white rounded"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span
                              className={`font-bold ${statusColor(order.status)}`}
                            >
                              {order.status}
                            </span>

                            <button
                              onClick={() => {
                                setEditingId(order.id);
                                setNewStatus(order.status);
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                              Update Status
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => previewPDF(order)}
                      className="px-4 py-2 bg-[#CD001A] text-white rounded-lg hover:bg-red-700 mt-4 sm:mt-0"
                    >
                      Preview PDF
                    </button>
                  </div>

                  {/* Shipping */}
                  <div className="mt-4 bg-gray-100 p-4 rounded-md">
                    <strong>Shipping:</strong> {order.shippingDetails.firstName}{" "}
                    {order.shippingDetails.lastName},{" "}
                    {order.shippingDetails.address}
                    <br />
                    <span className="font-semibold">City:</span>{" "}
                    {order.shippingDetails.city}
                    <br />
                    <span className="font-semibold">Country:</span>{" "}
                    {order.shippingDetails.country}
                    <br />
                    <span className="font-semibold">Phone:</span>{" "}
                    {order.shippingDetails.phone}
                  </div>

                  {/* Items */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.items.map((item) => {
                      const { image: variantImg, color: variantColor } =
                        parseVariant(item.image);

                      return (
                        <div
                          key={item._id}
                          className="bg-white border p-4 rounded-lg flex gap-4"
                        >
                          <img
                            src={variantImg || "/fallback.png"}
                            className="w-20 h-20 rounded object-cover"
                          />

                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm">Qty: {item.quantity}</p>
                            <p className="text-sm">Price: PKR {item.price}</p>

                            <div className="flex items-center gap-2 mt-2">
                              <span>Variant:</span>
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: `#${variantColor}` }}
                              ></div>

                              <span className="text-sm text-gray-600">
                                {(() => {
                                  try {
                                    return namer(`#${variantColor}`).basic[0]
                                      .name;
                                  } catch {
                                    return "Unknown";
                                  }
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        open={showPreview}
        pdfUrl={pdfUrl}
        onClose={() => setShowPreview(false)}
      />
    </RoleProtectedRoute>
  );
}
