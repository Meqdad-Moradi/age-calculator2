export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  rating: Rating;
}

export interface Rating {
  rate: number;
  count: number;
}
