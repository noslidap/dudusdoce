export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  prices: {
    [key: string]: number;
  };
  featured?: boolean;
  isNew?: boolean;
}

export type Size = '80ml' | '120ml' | '250ml' | '500ml' | '1000ml';

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface OrderItem {
  productId: string;
  size: Size;
  quantity: number;
}