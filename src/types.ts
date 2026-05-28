export interface User {
  id: string;
  phone: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  category: string;
  description: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  pros: string;
  cons: string;
  comment: string;
  date: string;
  status: 'pending' | 'approved';
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  userId?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  address: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  gradient: string;
}

export type Page = 'home' | 'product' | 'admin';
export type AdminTab = 'overview' | 'products' | 'reviews' | 'orders' | 'users';
