export interface Product {
  id: string;
  title: string;
  brand: string;
  model: string;
  category: string;
  category_slug: string;
  best_price_per_unit: number;
  shop_names: string[];
  price_list: number[];
  product_slug: string;
}
