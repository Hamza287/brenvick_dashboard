export interface ProductAttributes {
  [key: string]: string;
}

export interface Product {
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  id: number;        // ⭐ FORCED EXACTLY AS YOU WANT

  name: string;
  tagline: string;   // ⭐ ADDED HERE EXACTLY

  sku: string;
  description: string;
  price: number;
  compareAtPrice: number;
  brand: string;

  categoryId: number;
  color: string;

  attributes: ProductAttributes;

  stockOnHand: number;
  stockReserved: number;

  isActive: boolean;
}
