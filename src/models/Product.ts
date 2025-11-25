export interface ProductAttributes {
  [key: string]: string;
}

export interface Product {
  createdAt: string;
  updatedAt: string;
  id: number;

  name: string;
  tagline: string;

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
