import { Product } from "./Product";

export interface CartItem extends Product {
    quantity: number;
    size: string
}
  
  export interface CartState {
    items: CartItem[];
    total: number;
}