"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as jwt from "jwt-decode";
import { User } from "../models/User";
import { loginUser, fetchUserById } from "../services/authService";

interface JwtPayload {
  userId: number;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Login
  const login = async (username: string, password: string) => {
    try {
      const userData = await loginUser(username, password);
      setToken(userData.token);
      setUser(userData);
      router.push("/"); // redirect to dashboard
    } catch (err: any) {
      // Parse ErrorList from authService
      let errorList: string[] = [];
      try {
        errorList = JSON.parse(err.message);
      } catch {
        errorList = [err.message];
      }
      console.error("Login errors:", errorList);
      throw errorList; // throw array to frontend component
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  // Validate user from token
  const validateUser = async () => {
    if (!token) {
      logout();
      return;
    }

    try {
      const decoded = (jwt as unknown as (token: string) => JwtPayload)(token);
      const userId = decoded.userId;

      const userData = await fetchUserById(userId, token);
      setUser(userData);
    } catch (err: any) {
      // Handle ErrorList from fetchUserById
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

  // Auto-validate on token change
  useEffect(() => {
    if (token) {
      validateUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, validateUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
