import { useState } from 'react';
import { Transaction } from '../types/Transaction';
import TransactionService from '../api/TransactionService';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import UserService from '../api/UserService';

export const useTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { state: cart, dispatch: cartDispatch } = useCart();
  const { user } = useUser();

  const createTransaction = async () => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    if (cart.items.length === 0) {
      setError('Cart is empty');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const newTransaction = await TransactionService.createNewTransaction(user.id!, cart.total);

      for (const item of cart.items) {
        await TransactionService.createNewTransactionProduct(item, newTransaction.transactionId);
      }

      cartDispatch({ type: 'CLEAR_CART' });

      return newTransaction;
    } catch (err) {
      setError('Failed to create transaction');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTransactions = async () => {
    if (!user) {
      setError('User not authenticated');
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      const userTransactions = await UserService.getUserTransactions(user.id!);
      setTransactions(userTransactions);
      return userTransactions;
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTransaction,
    getUserTransactions,
    transactions,
    isLoading,
    error
  };
};