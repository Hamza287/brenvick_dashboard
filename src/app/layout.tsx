import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext"; // make sure the path is correct

export const metadata: Metadata = {
  title: "Brenvick Dashboard",
  description: "Admin Dashboard for Brenvick Ecommerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
