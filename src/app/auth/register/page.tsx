"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../../../components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call your register API here
      alert("Register API goes here!");
      router.push("/auth/login");
    } catch (err) {
      console.error("Register failed", err);
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

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-full border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#CD001A] focus:outline-none"
            placeholder="Full Name"
            required
          />
          <input
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
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
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-full border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#CD001A] focus:outline-none"
            placeholder="Confirm Password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--brand-red)] py-3 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="w-full rounded-full border border-[#CD001A] text-[#CD001A] py-3 font-semibold hover:bg-[var(--brand-red)] hover:text-white transition"
          >
            Already have an account? Login
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Brenvick, All rights reserved
        </p>
      </Card>
    </div>
  );
}
