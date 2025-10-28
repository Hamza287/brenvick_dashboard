// models/User.ts
export interface User {
  id: string;              // comes as string (MongoDB ObjectId)
  name: string;
  email: string;
  provider: "local" | "google" | "facebook" | string;
  role: "admin" | "user" | string;
  token?: string;          // included only after login
}
