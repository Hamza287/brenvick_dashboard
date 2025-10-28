export interface ProductAttributes {
  [key: string]: string;
}

export interface Product {
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  compareAtPrice: number;
  brand: string;
  categoryId: number; // 🆕 changed from category: string
  color: string;
  attributes: ProductAttributes;
  stockOnHand: number;
  stockReserved: number;
  isActive: boolean;
}
