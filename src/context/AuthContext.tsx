"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "../models/User";
import { loginUser, fetchUserById } from "../services/authService";

interface JwtPayload {
  userId?: number;
  sub?: string;
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

  const login = async (username: string, password: string) => {
    try {
      const userData = await loginUser(username, password);

      if (!userData?.token) throw new Error("Token missing in response");

      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(userData.token);
      setUser(userData);

      if (userData.role === 1) {
        router.push("/");
      } else if (userData.role === 0) {
        window.location.href = "/customer";
      }
    } catch (err: any) {
      console.error("Login error:", err.message);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const validateUser = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken || !storedUser) {
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);

      const decoded = decodeJwt<JwtPayload>(storedToken);
      const userId = decoded.userId || Number(decoded.sub);

      if (userId) {
        await fetchUserById(userId, storedToken);
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
