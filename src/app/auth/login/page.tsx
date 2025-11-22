// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 🔥 THIS IS THE FIX — use the AuthContext login
      await login(identifier, password);

    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-[var(--brand-red)] opacity-30 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Brenvick Logo" className="h-14" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full rounded-full border px-4 py-3 text-sm text-gray-900 focus:border-[#CD001A] focus:outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full border px-4 py-3 text-sm text-gray-900 focus:border-[#CD001A] focus:outline-none"
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--brand-red)] py-3 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Brenvick, All rights reserved
        </p>
      </div>
    </div>
  );
}
