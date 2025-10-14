import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import AuthGate from "../components/AuthGate"; // ✅ import the client component

export const metadata: Metadata = {
  title: "Brenvick Dashboard",
  description: "Admin Dashboard for Brenvick Ecommerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <AuthGate>{children}</AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
