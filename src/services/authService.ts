import { api } from "./api";
import { User } from "../models/User";
import { GenericResponse } from "../models/GenericResponse";

/**
 * ✅ Login User
 */
export const loginUser = async (
  username: string,
  password: string
): Promise<User> => {
  const res = await api.post<GenericResponse<User>>("/api/User/login", {
    username,
    passwordHash: password,
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

/**
 * ✅ Fetch user by ID
 */
export const fetchUserById = async (
  userId: number,
  token: string
): Promise<User> => {
  const res = await api.get<GenericResponse<User>>(`/api/User/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;

  if ((data.errorList ?? []).length > 0) {
    throw new Error(JSON.stringify(data.errorList));
  }

  if (!data.success || !data.result) {
    throw new Error(data.message || "User fetch failed");
  }

  return data.result;
};

/**
 * ✅ Create new user
 */
export const createUser = async (
  user: Partial<User>,
  token: string
): Promise<User> => {
  const res = await api.post<GenericResponse<User>>(
    "/api/User",
    user,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = res.data;

  if ((data.errorList ?? []).length > 0) {
    throw new Error(JSON.stringify(data.errorList));
  }

  if (!data.success || !data.result) {
    throw new Error(data.message || "User creation failed");
  }

  return data.result;
};

/**
 * ✅ Update existing user
 */
export const updateUser = async (
  user: Partial<User>,
  token: string
): Promise<User> => {
  const res = await api.put<GenericResponse<User>>(
    "/api/User",
    user,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = res.data;

  if ((data.errorList ?? []).length > 0) {
    throw new Error(JSON.stringify(data.errorList));
  }

  if (!data.success || !data.result) {
    throw new Error(data.message || "User update failed");
  }

  return data.result;
};

/**
 * ✅ Delete user by ID
 */
export const deleteUser = async (
  userId: number,
  token: string
): Promise<User> => {
  const res = await api.delete<GenericResponse<User>>(
    `/api/User/${userId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = res.data;

  if ((data.errorList ?? []).length > 0) {
    throw new Error(JSON.stringify(data.errorList));
  }

  if (!data.success || !data.result) {
    throw new Error(data.message || "User delete failed");
  }

  return data.result;
};

/**
 * ✅ Search users (for filtered lists)
 */
export const searchUsers = async (
  filter: Partial<User>,
  token: string
): Promise<User[]> => {
  const res = await api.post<GenericResponse<User[]>>(
    "/api/User/search",
    filter,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = res.data;

  if ((data.errorList ?? []).length > 0) {
    throw new Error(JSON.stringify(data.errorList));
  }

  if (!data.success || !data.result) {
    throw new Error(data.message || "User search failed");
  }

  return data.result;
};
