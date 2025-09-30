import { api } from "./api";
import { User } from "../models/User";
import { GenericResponse } from "../models/GenericResponse";

export const loginUser = async (
  username: string,
  password: string
): Promise<User> => {
  const res = await api.post<GenericResponse<User>>("/api/User/login", {
    username,
    passwordHash: password,
  });

  const data = res.data;

  // Null-safe error list check
  if ((data.errorList ?? []).length > 0) {
    throw new Error(JSON.stringify(data.errorList));
  }

  if (!data.success || !data.result) {
    throw new Error(data.message || "Login failed");
  }

  return data.result; // contains user + token
};

export const fetchUserById = async (userId: number, token: string): Promise<User> => {
  const res = await api.get<GenericResponse<User>>(`/api/User/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;
  if ((data.errorList ?? []).length > 0) {
    throw new Error(JSON.stringify(data.errorList));
  }

  if (!data.success || !data.result) {
    throw new Error(data.message || "Login failed");
  }

  return data.result;
};
