import { Product } from "./Product";

export interface CartItem extends Product {
    quantity: number;
    size: string
}
  
  export interface Cart {
    items: CartItem[];
    total: number;
}