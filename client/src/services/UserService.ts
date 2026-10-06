import api from '../api/api';
import { User, LoginResponse, createUserFromJson } from '../types/User';
import { mapJsonToTransactions, Transaction } from '../types/Transaction';

const USER_URL = `/user`;

export const UserService = {
  async syncAuth0User(profileData?: Partial<User>): Promise<User> {
    try {
      const payload = profileData ? {
        email: profileData.email,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        username: profileData.username,
      } : undefined;

      const response = await api.post(`${USER_URL}/sync`, payload);
      return createUserFromJson(response.data.user);
    } catch (error) {
      console.error('Error syncing Auth0 user:', error);
      throw error;
    }
  },

  async verifyToken(): Promise<LoginResponse> {
    try {
      const response = await api.post(`${USER_URL}/verify`);
      return { 
        access_token: response.data.access_token || '', 
        user: createUserFromJson(response.data.user) 
      };
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`${USER_URL}/${encodeURIComponent(userId)}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async updateUser(userData: User): Promise<User> {
    try {
      const payload = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone_number: userData.phoneNumber,
        address: userData.address,
        username: userData.username,
        email: userData.email,
      };

      const response = await api.put(`${USER_URL}/${encodeURIComponent(userData.id!)}`, payload);
      return createUserFromJson(response.data);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const response = await api.get(`${USER_URL}/${encodeURIComponent(userId)}/transactions`);
      return mapJsonToTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },
};

export default UserService;