// models/Order.ts

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  colors: string[];
  images: string[];
  stock: number;
}

export interface OrderItem {
  _id: string;
  product: Product;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  user: string; // user ID reference
  shippingDetails: ShippingDetails;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// models/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
  provider: string;
  role: "admin" | "user" | string; // ✅ role is a string now
  token?: string;
}
