"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Card from "../../../components/ui/Card";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username.trim(), password);
      // navigate after successful login
      router.push("/");
    } catch (err: any) {
      // err is now an Error with message
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black relative">
      {/* Red glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-[var(--brand-red)] opacity-30 blur-[120px]"></div>
      </div>

      <Card className="relative z-10 w-full max-w-sm rounded-2xl p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Brenvick Logo" className="h-14" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-full border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#CD001A] focus:outline-none"
            placeholder="Email / Phone Number"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#CD001A] focus:outline-none"
            placeholder="Password"
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Social logins */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <img src="/google-icon.svg" alt="Google" className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <img src="/facebook-icon.svg" alt="Facebook" className="h-6 w-6" />
            </button>
          </div>

          {/* Primary button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--brand-red)] py-3 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Let’s Go"}
          </button>

          {/* Secondary action -> go to /auth/register */}
          <button
            type="button"
            onClick={() => router.push("/auth/register")}
            className="w-full rounded-full border border-[#CD001A] text-[#CD001A] py-3 font-semibold hover:bg-[var(--brand-red)] hover:text-white transition"
          >
            New Account
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Brenvick, All rights reserved
        </p>
      </Card>
    </div>
  );
}
