"use client";

import RoleProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/layout/Sidebar";

export default function PaymentsPage() {
  return (
    <RoleProtectedRoute allowedRoles={[1]}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="h-screen" />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
          <p className="text-gray-600 mt-2">
            Review and manage all transactions and payment records.
          </p>

          {/* Placeholder for payments data */}
          <div className="mt-6 bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              No payment records found. Transactions will appear here once processed.
            </p>
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
