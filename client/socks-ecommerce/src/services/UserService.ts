import api from '../api/api';
import { User, LoginCredentials, LoginResponse, createUserFromJson } from '../types/User';
import SecurityUtils from '../utils/Security';
import { mapJsonToTransactions, Transaction } from '../types/Transaction';

const USER_URL = `/user`;

export const UserService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
      try {
        const { hashedPassword } = await SecurityUtils.hashPassword(credentials.password);
        
        const loginPayload = {
          username: credentials.username,
          password: hashedPassword
        };

        const response = await api.post('/login', loginPayload);
        
        return { access_token: response.data.access_token, user: createUserFromJson(response.data.user) };
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },

    async verifyToken(): Promise<LoginResponse> {
      try {
        const response = await api.post(`${USER_URL}/verify`);
        
        return { access_token: response.data.access_token, user: createUserFromJson(response.data.user) };
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
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone_number: userData.phoneNumber,
          };

          const response = await api.post(USER_URL, userDataWithHashedPassword);
          
          return { access_token: response.data.access_token, user: createUserFromJson(response.data.user) };
        } catch (error) {
          console.error('Error registering user:', error);
          throw error;
        }
      },

      async deleteUser(userId: number): Promise<void> {
        try {
          await api.delete(`${USER_URL}/${userId}`);
        } catch (error) {
          console.error('Error deleting user:', error);
          throw error;
        }
      },

      async updateUser(userData: User): Promise<User> {
        try {
          const { hashedPassword } = await SecurityUtils.hashPassword(userData.password!);

          const userDataWithHashedPassword = {
            ...userData,
            password: userData.password ? hashedPassword : 'none',
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone_number: userData.phoneNumber,
          };

          const response = await api.put(`${USER_URL}/${userData.id}`, userDataWithHashedPassword);
          
          return createUserFromJson(response.data);

        } catch (error) {
          console.error('Error deleting user:', error);
          throw error;
        }
      },

      async getUserTransactions(userId: number): Promise<Transaction[]> {
        try {
          const response = await api.get(`${USER_URL}/${userId}/transactions`);

          return mapJsonToTransactions(response.data);;
        } catch (error) {
          console.error('Error fetching transaction:', error);
          throw error;
        }
      },
};

export default UserService;