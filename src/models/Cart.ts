// models/Cart.ts

export interface Cart {
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
  id: string;          // Guid (as string)
  userId: number;
  currency: string;
}
