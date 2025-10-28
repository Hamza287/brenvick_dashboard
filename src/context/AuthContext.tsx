"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "../models/User";
import { API_BASE_URL } from "../utils/constants";

interface JwtPayload {
  id?: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  validateUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

function decodeJwt<T = any>(token: string): T {
  try {
    const base64Payload = token.split(".")[1];
    const jsonPayload = atob(base64Payload);
    return JSON.parse(jsonPayload);
  } catch {
    throw new Error("Invalid token");
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * ✅ LOGIN FUNCTION
   * Calls the backend API and stores user/token
   */
  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: username, password }),
      });

      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Login failed");

      const loggedUser = data.user as User;
      const jwtToken = data.token as string;

      // ✅ Only admin can login
      if (loggedUser.role !== "admin") {
        throw new Error("Access denied. Only admin can login.");
      }

      // ✅ Save to localStorage
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      // ✅ Update state
      setUser(loggedUser);
      setToken(jwtToken);

      // ✅ Navigate to dashboard
      router.replace("/");
    } catch (err: any) {
      console.error("Login error:", err.message);
      throw err;
    }
  };

  /**
   * ✅ LOGOUT FUNCTION
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    router.replace("/auth/login");
  };

  /**
   * ✅ VALIDATE USER (runs on page reload)
   */
  const validateUser = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken || !storedUser) {
        setLoading(false);
        return;
      }

      // ✅ Parse user
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);

      // ✅ Check token expiry
      const decoded = decodeJwt<JwtPayload>(storedToken);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        console.warn("Token expired, logging out...");
        logout();
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, validateUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
