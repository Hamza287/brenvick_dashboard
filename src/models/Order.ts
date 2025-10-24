// models/Order.ts

import { OrderStatus } from "./Enums";

export interface Order {
  createdAt: string;     // ISO date string
  updatedAt: string;     // ISO date string
  id: number;
  orderNo: string;
  userId: number;
  email: string;
  status: OrderStatus;   // using enum from Enums.ts
  currency: string;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingRegion: string;
  shippingPostal: string;
  shippingCountry: string;
  notes: string;
  placedAt: string;      // ISO date string
}
