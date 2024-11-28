import { CartState } from "./Cart";

export interface Transaction {
    cart: CartState;
    purchase_time: string;
    order_status: string;
    userId: number;
  }