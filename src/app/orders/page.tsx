"use client";

import { useEffect, useState } from "react";
import RoleProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/layout/Sidebar";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import { getTcsShippingLabel } from "../../services/tcsService"; // ⬅️ NEW IMPORT
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
    
    // ⬇️ NEW STATE FOR TCS BUTTON LOADING
    const [tcsLoadingId, setTcsLoadingId] = useState<string | null>(null); 

    // For Updating Status
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newStatus, setNewStatus] = useState("");

    // Filters
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateSort, setDateSort] = useState("Newest");
    const [phoneFilter, setPhoneFilter] = useState("");

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
      VARIANT PARSER & STATUS COLOR (No Changes)
    ======================================================================================== */
    const parseVariant = (
        imageField: any
    ): { color: string; image: string | null } => {
        try {
            if (!imageField) return { color: "000000", image: null };
            let parsed =
                typeof imageField === "string" ? JSON.parse(imageField) : imageField;

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
      UPDATE ORDER STATUS (No Changes)
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
      PDF GENERATOR (No Changes)
    ======================================================================================== */
    const previewPDF = async (order: Order) => {
        try {
            const pdf = new jsPDF("p", "mm", "a4");

            // ⭐ Convert logo to Base64
            const logoBase64 = await toBase64("/brenvickPDF.png");

            // ⭐ Center the logo
            const pageWidth = pdf.internal.pageSize.getWidth();
            const logoWidth = 40;
            const logoHeight = 20;
            const centerX = (pageWidth - logoWidth) / 2;

            pdf.addImage(logoBase64, "PNG", centerX, 10, logoWidth, logoHeight);

            // Push content below the centered logo
            let y = 40;

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
      TCS LABEL FETCHER
    ======================================================================================== */
    const handleTcsLabelFetch = async (orderId: string, consignmentNo: string) => {
        if (!consignmentNo) {
            alert("Error: Consignment number not found for this order.");
            return;
        }

        setTcsLoadingId(orderId);
        setError(null);

        try {
            // 1. Fetch the PDF Blob using the service
            const { pdfBlob } = await getTcsShippingLabel(consignmentNo);

            // 2. Create a Blob URL for preview/printing
            const blobUrl = URL.createObjectURL(pdfBlob);

            // 3. Set state to show the preview modal
            setPdfUrl(blobUrl);
            setShowPreview(true);

            // Cleanup function will be needed, but for now, we leave the URL for the modal
        } catch (err: any) {
            const message = err.message || "Failed to fetch TCS label.";
            console.error("TCS Label Fetch Error:", err);
            alert(message);
        } finally {
            setTcsLoadingId(null);
        }
    };


    /* ========================================================================================
      FILTERED + SORTED ORDERS (No Changes)
    ======================================================================================== */
    const filteredOrders = orders
        .filter((order) => {
            if (statusFilter !== "All" && order.status !== statusFilter) return false;

            if (phoneFilter.trim() !== "") {
                return order.shippingDetails.phone
                    .toLowerCase()
                    .includes(phoneFilter.toLowerCase());
            }

            return true;
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateSort === "Newest" ? dateB - dateA : dateA - dateB;
        });

    /* ========================================================================================
      RENDER UI (Updated)
    ======================================================================================== */
    return (
        <RoleProtectedRoute allowedRoles={["admin"]}>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />

                <main className="flex-1 p-8 overflow-y-auto">
                    <h1 className="text-2xl font-bold">Orders</h1>

                    {/* FILTER BAR (No Changes) */}
                    <div className="mt-4 flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow border">
                        {/* Status Filter, Date Sort, Phone Search... (omitted for brevity) */}
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

                        <div>
                            <label className="font-semibold mr-2 text-[#CD001A]">Search Phone:</label>
                            <input
                                type="text"
                                placeholder="03XX..."
                                value={phoneFilter}
                                onChange={(e) => setPhoneFilter(e.target.value)}
                                className="border px-3 py-2 rounded-md"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <p className="mt-6">Loading...</p>
                    ) : error ? (
                        <p className="mt-6 text-red-500">{error}</p>
                    ) : (
                        <div className="mt-6 space-y-6">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="bg-white p-6 rounded-xl shadow border text-black">
                                    
                                    {/* HEADER */}
                                    <div className="flex justify-between items-center flex-wrap">
                                        <div>
                                            <h2 className="font-semibold text-lg">
                                                Order ID: {order.id}
                                            </h2>
                                            {/* Assuming you have a `consignmentNo` property on your Order model for TCS */}
                                            {order.tcsConsignmentNo && ( 
                                                <p className="text-sm mt-1 font-bold text-gray-700">
                                                    CN: {order.tcsConsignmentNo}
                                                </p>
                                            )}

                                            <p className="text-sm mt-1">
                                                Date: {new Date(order.createdAt).toLocaleString()}
                                            </p>
                                            
                                            {/* Status Update UI... (omitted for brevity) */}
                                            <div className="mt-2 flex items-center gap-3 flex-wrap">
                                                <span className="font-semibold">Status:</span>

                                                {editingId === order.id ? (
                                                    // ... editing UI ...
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
                                                        <span className={`font-bold ${statusColor(order.status)}`}>
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

                                        {/* ACTION BUTTONS */}
                                        <div className="flex gap-3 mt-4 sm:mt-0">
                                            {/* ⬇️ NEW: TCS Label Button */}
                                            <button
                                                onClick={() => handleTcsLabelFetch(order.id, order.tcsConsignmentNo!)}
                                                disabled={tcsLoadingId === order.id || !order.tcsConsignmentNo}
                                                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                                                    order.tcsConsignmentNo
                                                        ? 'bg-orange-500 hover:bg-orange-600'
                                                        : 'bg-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {tcsLoadingId === order.id ? 'Loading Label...' : 'Print TCS Label'}
                                            </button>

                                            {/* Existing Preview PDF Button */}
                                            <button
                                                onClick={() => previewPDF(order)}
                                                className="px-4 py-2 bg-[#CD001A] text-white rounded-lg hover:bg-red-700"
                                            >
                                                Preview PDF
                                            </button>
                                        </div>
                                    </div>

                                    {/* SHIPPING and ITEMS details... (omitted for brevity) */}
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

                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Items mapping... */}
                                        {order.items.map((item) => {
                                            const { image: variantImg, color: variantColor } =
                                                parseVariant(item.image);
                    
                                            return (
                                                <div key={item._id} className="bg-white border p-4 rounded-lg flex gap-4">
                                                    <img
                                                        src={variantImg || "/fallback.png"}
                                                        className="w-20 h-20 rounded object-cover"
                                                        alt={item.name}
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
                                                                        return namer(`#${variantColor}`).basic[0].name;
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

            <PDFPreviewModal
                open={showPreview}
                pdfUrl={pdfUrl}
                onClose={() => {
                    // 💡 Clean up the Blob URL when the modal closes
                    if (pdfUrl) {
                        URL.revokeObjectURL(pdfUrl);
                    }
                    setPdfUrl(null);
                    setShowPreview(false);
                }}
            />
        </RoleProtectedRoute>
    );
}