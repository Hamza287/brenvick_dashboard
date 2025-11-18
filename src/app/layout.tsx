import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import AuthGate from "../components/AuthGate";

export const metadata: Metadata = {
  title: "Brenvick Dashboard",
  description: "Admin Dashboard for Brenvick Ecommerce",
};

// ✅ Convert layout to a server component that delegates client logic
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50" suppressHydrationWarning>
        <AuthProvider>
          <AuthGate>{children}</AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}

