import { CartState } from "./Cart";
import { ProductJson } from "./Product";

export interface Transaction {
    cart?: CartState;
    purchaseTime: string;
    orderStatus: string;
    userId: number;
    transactionId: number;
  }

  interface JsonResponse {
    user_id: number;
    transaction_id: number;
    purchase_time: string;
    total_price: number;
    order_status: string;
    transaction_products: JsonTransactionProduct[];
  }
  
  interface JsonTransactionProduct {
    quantity: number;
    size: string;
    transaction_id: number;
    product_id: number;
    product: ProductJson;
  }

  export const mapJsonToTransactions =(jsonResponse: JsonResponse[]): Transaction[] => {
    return jsonResponse.map((transaction) => (mapJsonToTransaction(transaction)));
  }

  export const mapJsonToTransaction =(jsonResponse: JsonResponse): Transaction => {
    return {
      userId: jsonResponse.user_id,
      purchaseTime: jsonResponse.purchase_time,
      orderStatus: jsonResponse.order_status,
      transactionId: jsonResponse.transaction_id,
      cart: {
        total: jsonResponse.total_price,
        items: jsonResponse.transaction_products?.map((productEntry) => ({
          quantity: productEntry.quantity,
          size: productEntry.size,
          productId: productEntry.product.product_id,
          name: productEntry.product.name,
          price: productEntry.product.price,
          description: productEntry.product.description,
          image: productEntry.product.image,
          category: productEntry.product.category,
          sizes: productEntry.product.sizes,
          inStock: productEntry.product.in_stock,
        })),
      },
    };
  }