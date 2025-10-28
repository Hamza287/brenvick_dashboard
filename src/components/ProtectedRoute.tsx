"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // ✅ now string[] (e.g. ["admin"], ["user"], ["admin","user"])
}

export default function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ✅ Wait for auth context to finish loading
    if (loading) return;

    // ✅ No user or token → force login
    if (!token || !user) {
      router.replace("/auth/login");
      return;
    }

    // ✅ Unauthorized role → redirect accordingly
    if (!allowedRoles.includes(user.role)) {
      if (user.role === "user") {
        // redirect customers to public site (optional)
        window.location.href = "https://example.com/";
      } else {
        router.replace("/403"); // you can create an Access Denied page
      }
    }
  }, [loading, token, user, allowedRoles, router]);

  // ✅ Show loader while checking auth
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  // ✅ Render content only when authorized
  return <>{children}</>;
}
