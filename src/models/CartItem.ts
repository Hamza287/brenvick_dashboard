// models/CartItem.ts

export interface CartItem {
  id: number;
  cartId: string;      // Guid (as string)
  productId: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: string;   // ISO date string
}
