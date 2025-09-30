"use client";

import ProtectedRoute from "../components/ProtectedRoute";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Welcome to the Dashboard!</h1>
        {/* Your main dashboard content goes here */}
      </div>
    </ProtectedRoute>
  );
}
