import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../utils/constants";

// Base axios instance (no auth)
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authorized instance factory
export const authorizedApi = (token: string | null) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Attach token if available
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (token) {
        // ✅ safer way: set header directly
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};
