import api from '../api/api';
import { Transaction, mapJsonToTransaction } from '../types/Transaction';
import { CartItem } from '../types/Cart';

const TRANSACTION_URL = `/transaction`;

export const TransactionService = {
    async createNewTransaction(userId: string | number, total: number): Promise<Transaction> {
      try {
        const transactionPayload = {
            user_id: String(userId),
            total_price: total,
          };

        const response = await api.post(TRANSACTION_URL, transactionPayload);
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
  
          const response = await api.post(`${TRANSACTION_URL}/${transactionId}/product`, payload);
          return mapJsonToTransaction(response.data);
        } catch (error) {
          console.error('Error creating transaction product:', error);
          throw error;
        }
      },

    async getAllTransactions(): Promise<Transaction[]> {
      try {
        const response = await api.get(`/transactions`);
        return (response.data || []).map((tx: any) => mapJsonToTransaction(tx));
      } catch (error) {
        console.error('Error fetching all transactions:', error);
        throw error;
      }
    },

    async updateTransactionStatus(transactionId: number, orderStatus: string): Promise<Transaction> {
      try {
        const response = await api.put(`${TRANSACTION_URL}/${transactionId}/status`, {
          order_status: orderStatus,
        });
        return mapJsonToTransaction(response.data);
      } catch (error) {
        console.error(`Error updating transaction ${transactionId} status:`, error);
        throw error;
      }
    },
};

export default TransactionService;