import api from './api';
import { User, LoginCredentials, LoginResponse } from '../types/User';

export const UserService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
      try {
        const response = await api.post<LoginResponse>('/login', credentials);
        return response.data;
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },

    async register(userData: User): Promise<void> {
        try {
          await api.post('/user', userData);
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
};

export default UserService;