"use client";

import React from "react";

export default function PDFPreviewModal({
  open,
  pdfUrl,
  onClose,
}: {
  open: boolean;
  pdfUrl: string | null;
  onClose: () => void;
}) {
  if (!open || !pdfUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-[800px] h-[90%] p-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">PDF Preview</h2>
          <button
            className="text-red-600 font-bold text-xl px-2"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Embedded PDF */}
        <iframe
          src={pdfUrl}
          className="w-full flex-1 rounded border"
        ></iframe>

        {/* Download Button */}
        <a
          href={pdfUrl}
          download="Order.pdf"
          className="mt-4 bg-[#CD001A] text-white w-full text-center py-2 rounded-lg hover:bg-red-700"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}
