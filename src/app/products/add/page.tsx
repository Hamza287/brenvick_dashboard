"use client";

import RoleProtectedRoute from "../../../components/ProtectedRoute";
import Sidebar from "../../../components/layout/Sidebar";
import Card from "../../../components/ui/Card";
import TextBox from "../../../components/ui/TextBox";
import Button from "../../../components/ui/Button";
import { UploadCard } from "../../../components/ui/UploadCard";

export default function AddProductPage() {
  return (
    <RoleProtectedRoute allowedRoles={[1]}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="h-screen" />

        {/* Main Content */}
        <main className="flex-1 p-8 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--brand-red)] focus:border-[var(--brand-red)]">
              <option>Select Product</option>
              <option>Smart Watch</option>
              <option>Phone</option>
              <option>Laptop</option>
            </select>
          </div>

          {/* Centered Responsive Container */}
          <div className="flex justify-center w-full">
            <Card className="w-full max-w-[95%] xl:max-w-[1400px] p-10">
              <h2 className="text-xl font-semibold mb-8 text-gray-800">
                General Information
              </h2>

              {/* Two-column layout inside card */}
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-12">
                {/* LEFT SIDE — Form */}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextBox
                      label="Product Name"
                      placeholder="Enter product name"
                    />
                    <TextBox
                      label="Semi Heading"
                      placeholder="Enter semi heading"
                    />
                  </div>

                  <TextBox
                    label="Description"
                    placeholder="Enter description"
                    textarea
                    rows={4}
                  />

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        "#000000",
                        "#7D7D7D",
                        "#CD001A",
                        "#007AFF",
                        "#4CAF50",
                        "#9C27B0",
                      ].map((color) => (
                        <button
                          key={color}
                          style={{ backgroundColor: color }}
                          className="w-6 h-6 rounded-full border border-gray-300"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextBox
                      label="Base Pricing"
                      placeholder="e.g. 789.00 PKR"
                    />
                    <TextBox label="Stock" placeholder="e.g. 77" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextBox label="Discount" placeholder="e.g. 10%" />
                    <TextBox label="Discount Type" placeholder="e.g. 14th August" />
                  </div>

                  <TextBox
                    label="Terms & Conditions (Optional)"
                    placeholder="Enter any terms & conditions"
                  />
                </div>

                {/* RIGHT SIDE — Image Upload Section */}
                <div className="flex flex-col justify-start">
                  <label className="text-sm font-medium text-gray-700 mb-3">
                    Product Images
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <UploadCard key={index} />
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 mt-3 leading-snug">
                    The image format should be <b>jpg/jpeg/png</b>. <br />
                    Minimum size: <b>300×300px</b>. Recommended: <b>700×700px</b>.
                  </p>
                </div>
              </div>

              {/* Add Product Button */}
              <div className="mt-10 flex justify-end">
                <Button className="px-8 py-3 text-base font-semibold w-full sm:w-auto">
                  Add Product
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
