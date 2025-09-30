"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "../models/User";
import { loginUser, fetchUserById } from "../services/authService";

interface JwtPayload {
  userId?: number;
  sub?: string; // sometimes backend sends userId in "sub"
  exp: number;
  iat: number;
  [key: string]: any;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  validateUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

function decodeJwt<T = any>(token: string): T {
  try {
    const base64Payload = token.split(".")[1];
    const jsonPayload = atob(base64Payload); // works in browser
    return JSON.parse(jsonPayload);
  } catch {
    throw new Error("Invalid token");
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // 🔑 Login
  const login = async (username: string, password: string) => {
    try {
      const userData = await loginUser(username, password);

      if (!userData?.token) {
        throw new Error("Token missing in response");
      }

      setToken(userData.token);
      setUser(userData);
      router.push("/"); // redirect to dashboard
    } catch (err: any) {
      let errorList: string[] = [];
      try {
        errorList = JSON.parse(err.message);
      } catch {
        errorList = [err.message];
      }
      console.error("Login errors:", errorList);
      throw errorList;
    }
  };

  // 🚪 Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  // 🔍 Validate user from token
  const validateUser = async () => {
    if (!token) {
      logout();
      return;
    }

    try {
      const decoded = decodeJwt<JwtPayload>(token);
      const userId = decoded.userId || Number(decoded.sub);

      if (!userId) {
        throw new Error("Token does not contain userId");
      }

      const userData = await fetchUserById(userId, token);
      setUser(userData);
    } catch (err: any) {
      let errorList: string[] = [];
      try {
        errorList = JSON.parse(err.message);
      } catch {
        errorList = [err.message];
      }
      console.error("Token validation errors:", errorList);
      logout();
    }
  };

  // 🔄 Auto-validate on token change
  useEffect(() => {
    if (token) {
      validateUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, validateUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
