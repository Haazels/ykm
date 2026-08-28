export type ProductCategory = "wireless" | "defense" | "drones";

export interface ProductSpec {
  l: string;
  v: string;
}

export interface Product {
  id: number;
  name: string;
  cat: ProductCategory;
  badge?: string;
  price: number;
  old?: number;
  img: string;
  thumb: string;
  desc: string;
  specs: ProductSpec[];
  stock: number;
}

export interface ProductReview {
  name: string;
  rating: number;
  text: string;
  images: string[];
}

export interface CartItem extends Product {
  qty: number;
}

export interface TestimonialReview {
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  hasHalf: boolean;
  ratingLabel: string;
}

export interface ShortVideo {
  href: string;
  thumbnail: string;
  title: string;
  channel: string;
}

export type AuthMethod =
  | "password"
  | "magic_link"
  | "email_otp"
  | "google";

export interface AuthUser {
  id: string;
  email: string;
  method: AuthMethod;
}

export interface PurchaseOrderItem {
  id: number;
  name: string;
  thumb: string;
  price: number;
  qty: number;
}

export interface PurchaseOrder {
  orderId: string;
  date: string;
  items: PurchaseOrderItem[];
  total: number;
  buyerName: string;
  buyerContact: string;
  deliveryAddress: string;
}

export interface ViewedProduct {
  id: number;
  name: string;
  thumb: string;
  price: number;
  viewedAt: string;
}
