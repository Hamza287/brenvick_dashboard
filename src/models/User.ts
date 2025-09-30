// models/User.ts
export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash?: string; // usually optional on frontend
  token?: string;
  name: string;
  phone: string;
  role: number;
  isActive: boolean;
  lastLoginAt: string; // ISO string, you can convert to Date if needed
  createdAt: string;
  updatedAt: string;
}
