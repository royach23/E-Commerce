  import React, { 
    createContext, 
    useState, 
    useContext, 
    ReactNode,
    useEffect
  } from 'react';
  import { 
    User, 
    LoginCredentials,
  } from '../types/User';
  import UserService from '../services/UserService';
  import { useCart } from './CartContext';
  import { Transaction } from '../types/Transaction';

  interface UserContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    register: (userData: User) => Promise<void>;
    getUserTransactions: (userId: number) => Promise<Transaction[]>;
    deleteUser: (userId: number) => Promise<void>;
    updateUser: (userId: number) => Promise<void>;
    isAuthenticated: boolean;
  }

  const UserContext = createContext<UserContextType | undefined>(undefined);

  export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { dispatch: cartDispatch } = useCart();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        verifyToken();
      }
    }, []);

    const verifyToken = async () => {
      try {
        const response = await UserService.verifyToken();
        setUser(response.user);
        setIsAuthenticated(true);
      } catch (error) {
        logout();
        throw error;
      }
    };

    const login = async (credentials: LoginCredentials) => {
      try {
        const { access_token, user } = await UserService.login(credentials);
        localStorage.setItem('token', access_token);
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        logout();
        throw error;
      }
    };

    const logout = () => {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      
      cartDispatch({ type: 'CLEAR_CART' });
    };

    const register = async (userData: User) => {
      const { access_token, user } = await UserService.register(userData);
      localStorage.setItem('token', access_token);
      setUser(user);
      setIsAuthenticated(true);
    };

    const getUserTransactions = async (userId: number): Promise<Transaction[]> => {
      return await UserService.getUserTransactions(userId);
    };

    const deleteUser = async (userId: number) => {
      await UserService.deleteUser(userId);
      logout();
    };

    const updateUser = async (userId: number) => {
      await UserService.updateUser(userId);
    };

    return (
      <UserContext.Provider value={{ 
        user, 
        login, 
        logout, 
        register,
        getUserTransactions,
        deleteUser,
        updateUser,
        isAuthenticated 
      }}>
        {children}
      </UserContext.Provider>
    );
  };

  export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  };