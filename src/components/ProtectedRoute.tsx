"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: number[]; // example: [1] for admin, [0] for customer, [0,1] for both
}

export default function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ✅ Only run checks after loading is finished
    if (loading) return;

    // ✅ If no user or token → redirect to login
    if (!token || !user) {
      router.replace("/auth/login");
      return;
    }

    // ✅ If user role not allowed → redirect appropriately
    if (!allowedRoles.includes(user.role)) {
      if (user.role === 0) {
        // Example: redirect customers to a public site
        window.location.href = "https://example.com/";
      } else {
        router.replace("/");
      }
    }
  }, [loading, token, user, allowedRoles, router]);

  // ✅ While loading OR redirecting → show consistent loader
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  // ✅ Render children only if user is valid and allowed
  return <>{children}</>;
}
