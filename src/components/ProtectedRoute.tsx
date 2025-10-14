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
    if (!loading) {
      if (!token || !user) {
        router.push("/auth/login");
      } else if (!allowedRoles.includes(user.role)) {
        // If role not permitted → redirect accordingly
        if (user.role === 0) {
          window.location.href = "https://example.com/"; // Customer area
        } else {
          router.push("/"); // Admin default page
        }
      }
    }
  }, [loading, token, user, allowedRoles, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
