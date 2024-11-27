export interface Product {
    product_id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category?: string;
    sizes?: string[];
    in_stock: boolean;
  }