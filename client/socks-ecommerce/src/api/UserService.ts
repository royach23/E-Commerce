import api from './api';
import { User, LoginCredentials, LoginResponse } from '../types/User';
import SecurityUtils from '../utils/Security';
import { Transaction } from '../types/Transaction';

export const UserService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
      try {
        const { hashedPassword } = await SecurityUtils.hashPassword(credentials.password);
        
        const loginPayload = {
          username: credentials.username,
          password: hashedPassword
        };

        const response = await api.post<LoginResponse>('/login', loginPayload);
        return response.data;
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },

    async verifyToken(): Promise<LoginResponse> {
      try {
        const response = await api.post<LoginResponse>('/user/verify');
        return response.data;
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },

    async register(userData: User): Promise<LoginResponse> {
        try {

          const { hashedPassword } = await SecurityUtils.hashPassword(userData.password!);
          
          const userDataWithHashedPassword = {
            ...userData,
            password: hashedPassword,
          };

          const response = await api.post('/user', userDataWithHashedPassword);
          return response.data;
        } catch (error) {
          console.error('Error registering user:', error);
          throw error;
        }
      },

      async deleteUser(userId: number): Promise<void> {
        try {
          await api.delete(`/user/${userId}`);
        } catch (error) {
          console.error('Error deleting user:', error);
          throw error;
        }
      },

      async updateUser(userId: number): Promise<void> {
        try {
          await api.put(`/user/${userId}`);
        } catch (error) {
          console.error('Error deleting user:', error);
          throw error;
        }
      },

      async getUserTransactions(userId: number): Promise<Transaction[]> {
        try {
          const response = await api.get(`user/${userId}/transactions`);
          const transactions = {
            user_id: response.data.user_id,
            total_price: response.data.total_price, //continue matching to the postman 
          };

          return transactions;
        } catch (error) {
          console.error('Error fetching transaction:', error);
          throw error;
        }
      },
};

export default UserService;