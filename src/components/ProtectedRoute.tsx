"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // e.g., ["admin"], ["user"], ["admin", "user"]
}

export default function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false); // Prevent redundant redirects

  useEffect(() => {
    if (loading || isRedirecting) return; // Prevent further actions if already redirecting

    // If user or token is missing, redirect to login
    if (!token || !user) {
      router.replace("/auth/login"); // Redirect to login if not authenticated
      setIsRedirecting(true);
      return;
    }

    // If user does not have the required role, redirect
    if (!allowedRoles.includes(user.role)) {
      router.replace("/403"); // Redirect to 403 if unauthorized role
      setIsRedirecting(true);
    }
  }, [loading, token, user, allowedRoles, router, isRedirecting]);

  // Show loading state while checking auth status
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  // Render children when the user has the required role and is authenticated
  return <>{children}</>;
}
