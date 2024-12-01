import api from '../api/api';
import { Transaction, mapJsonToTransaction } from '../types/Transaction';
import { CartItem } from '../types/Cart';

export const TransactionService = {
    async createNewTransaction(userId: number, total: number): Promise<Transaction> {
      try {
        const transactionPayload = {
            user_id: userId,
            total_price: total,
          };

        const response = await api.post('/transaction', transactionPayload);
        return mapJsonToTransaction(response.data);
      } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }
    },

    async createNewTransactionProduct(product: CartItem, transactionId: number): Promise<Transaction> {
        try {
          const payload = {
            product_id: product.productId,
            quantity: product.quantity,
            size: product.size
          };
  
          const response = await api.post(`/transaction/${transactionId}/product`, payload);
          return mapJsonToTransaction(response.data);
        } catch (error) {
          console.error('Error creating transaction product:', error);
          throw error;
        }
      },

};

export default TransactionService;