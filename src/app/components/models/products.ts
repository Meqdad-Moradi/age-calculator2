export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  rating: Rating;
  image: string;
}

export interface Rating {
  rate: number;
  count: number;
}

export interface CartItem extends Product {
  quantity: number;
}
