export interface Category {
  id: number;
  name: string;
  slug: string;
  emoji?: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  old_price: number | null;
  badge: string | null;
  stock: number;
  image_url: string | null;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string | number;
  status: string;
  total_amount: number;
  address: string;
  created_at: string;
  items?: { product_name: string; quantity: number; unit_price: number }[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}
