"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // State to track if the user is admin

  useEffect(() => {
    // Check if the user is logged in and has an "admin" role
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    // If not an admin, redirect to login page
    if (isAdmin === false) {
      router.push("auth/login");
    }
  }, [isAdmin, router]);

  if (isAdmin === null) {
    // Optionally, you can display a loading state while the check is being done
    return <div>Loading...</div>;
  }
// test CI/CD pipeline
  if (!isAdmin) {
    return <div>Access Denied</div>; // You can also redirect or show a specific message here
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar className="h-screen" />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome, Admin!</p>
      </main>
    </div>
  );
}
