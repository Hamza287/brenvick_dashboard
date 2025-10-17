export interface Order {
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  id: number;
  orderNo: string;
  userId: number;
  email: string;
  status: number;
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
  placedAt: string; // ISO date string
}
