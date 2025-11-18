import { api } from "./api";
import { User } from "../models/User";

interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

export async function loginUser(identifier: string, password: string): Promise<User> {
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  const res = await api.post<AuthResponse>("/login", { identifier, password });
  const { success, user, token } = res.data;

  if (!success) throw new Error("Login failed");
  return { ...user, token };
}

export async function createUser(data: any): Promise<User> {
  const res = await api.post<AuthResponse>("/signup", data);
  const { success, user, token } = res.data;

  if (!success) throw new Error("Registration failed");
  return { ...user, token };
}
