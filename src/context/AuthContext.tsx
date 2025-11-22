"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "../models/User";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


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
    const res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: username, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    const loggedUser = data.user;
    const jwtToken = data.token;

    if (loggedUser.role !== "admin") {
      throw new Error("Access denied. Only admin can login.");
    }

    // Save token and user to localStorage
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(loggedUser));

    // Update React state
    setUser(loggedUser);
    setToken(jwtToken);

    // Navigate to the admin dashboard after login
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
      setLoading(false); // If no token or user, stop loading and exit
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setToken(storedToken);

    // Decode and check token expiration
    const decoded = decodeJwt(storedToken);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      console.warn("Token expired, logging out...");
      logout(); // Automatically log out if the token is expired
    }
  } catch (error) {
    console.error("Token validation failed:", error);
    logout();
  } finally {
    setLoading(false); // Set loading to false after validation is complete
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
