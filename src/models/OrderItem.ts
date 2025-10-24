// models/OrderItem.ts

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  attributesSnap: string;
}
