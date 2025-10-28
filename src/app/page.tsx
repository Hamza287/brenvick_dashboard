"use client";

import RoleProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardPage() {
  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="h-screen" />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, Admin!</p>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
