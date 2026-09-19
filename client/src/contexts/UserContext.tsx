import React, { 
  createContext, 
  useState, 
  useContext, 
  ReactNode,
  useEffect,
  useRef,
  useCallback
} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User } from '../types/User';
import UserService from '../services/UserService';
import { useCart } from './CartContext';
import { Transaction } from '../types/Transaction';
import { isAuth0Configured } from './Auth0ProviderWithConfig';

interface UserContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
  register: () => Promise<void>;
  getUserTransactions: (userId: string) => Promise<Transaction[]>;
  deleteUser: (userId: string) => Promise<void>;
  updateUser: (user: User) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  auth0Error?: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const checkAdminRole = (userData?: User | null, auth0UserData?: any, claimsData?: any): boolean => {
  if (userData?.isAdmin) return true;
  const rolesSet = new Set<string>();
  if (userData?.roles) {
    userData.roles.forEach((r) => rolesSet.add(r.toLowerCase()));
  }
  const addRoles = (val: any) => {
    if (Array.isArray(val)) {
      val.forEach((r) => typeof r === 'string' && rolesSet.add(r.trim().toLowerCase()));
    } else if (typeof val === 'string') {
      rolesSet.add(val.trim().toLowerCase());
    }
  };

  if (auth0UserData) {
    Object.keys(auth0UserData).forEach((k) => {
      if (k === 'roles' || k.endsWith('/roles') || k.endsWith('/claims/roles')) {
        addRoles(auth0UserData[k]);
      }
    });
  }
  if (claimsData) {
    Object.keys(claimsData).forEach((k) => {
      if (k === 'roles' || k.endsWith('/roles') || k.endsWith('/claims/roles') || k === 'permissions') {
        addRoles(claimsData[k]);
      }
    });
  }
  return rolesSet.has('admin') || rolesSet.has('administrator') || rolesSet.has('superadmin');
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const { dispatch: cartDispatch } = useCart();

  const lastSyncedSubRef = useRef<string | null>(null);
  const isSyncingRef = useRef<boolean>(false);

  const {
    isAuthenticated: auth0IsAuthenticated,
    user: auth0User,
    isLoading: auth0IsLoading,
    error: auth0Error,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
    getIdTokenClaims
  } = useAuth0();

  if (auth0Error) {
    console.error('Auth0 Authentication Error:', auth0Error);
  }

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    lastSyncedSubRef.current = null;
    isSyncingRef.current = false;
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    cartDispatch({ type: 'CLEAR_CART' });

    if (isAuth0Configured()) {
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    }
  }, [auth0Logout, cartDispatch]);


  // Sync Auth0 state with backend
  useEffect(() => {
    let isMounted = true;

    const syncAuth = async () => {
      if (!isAuth0Configured()) {
        // Fallback for development before Auth0 is configured
        const localToken = localStorage.getItem('token');
        if (localToken) {
          try {
            const response = await UserService.verifyToken();
            if (isMounted) {
              setUser(response.user);
              setIsAuthenticated(true);
            }
          } catch {
            if (isMounted) {
              logout();
            }
          }
        }
        if (isMounted) setIsLocalLoading(false);
        return;
      }

      if (auth0IsLoading) {
        return;
      }

      if (auth0IsAuthenticated && auth0User && auth0User.sub) {
        // Skip sync if already synced for this user session
        if (lastSyncedSubRef.current === auth0User.sub) {
          if (isMounted) setIsLocalLoading(false);
          return;
        }

        if (isSyncingRef.current) {
          return;
        }

        isSyncingRef.current = true;

        try {
          let token = '';
          const audience = import.meta.env.VITE_AUTH0_AUDIENCE?.trim();
          
          try {
            const rawToken = await getAccessTokenSilently(
              audience ? { authorizationParams: { audience } } : undefined
            );
            token = rawToken || '';
          } catch (tokenErr) {
            console.warn('Could not get silent access token:', tokenErr);
          }

          // If token is missing or opaque (not a 3-part JWT), fallback to raw ID token
          if (!token || token.split('.').length !== 3) {
            try {
              const claims = await getIdTokenClaims();
              if (claims?.__raw) {
                token = claims.__raw;
              }
            } catch (claimsErr) {
              console.warn('Could not get id token claims:', claimsErr);
            }
          }

          if (token) {
            localStorage.setItem('token', token);
          }

          // Pass user profile hints to ensure backend database has real name and email
          const profileHints: Partial<User> = {
            email: auth0User.email,
            firstName: auth0User.given_name,
            lastName: auth0User.family_name,
            username: auth0User.nickname || auth0User.name,
          };

          let claims: any = null;
          try {
            claims = await getIdTokenClaims();
          } catch {
            // ignore
          }

          const syncedUser = await UserService.syncAuth0User(profileHints);
          const adminStatus = checkAdminRole(syncedUser, auth0User as any, claims as any);
          if (isMounted) {
            lastSyncedSubRef.current = auth0User.sub;
            setUser(syncedUser);
            setIsAuthenticated(true);
            setIsAdmin(adminStatus);
          }
        } catch (error) {
          console.error('Failed to sync Auth0 user with backend:', error);
          let claims: any = null;
          try {
            claims = await getIdTokenClaims();
          } catch {
            // ignore
          }
          const adminStatus = checkAdminRole(null, auth0User as any, claims as any);
          // Fallback baseline user from Auth0 profile so UI continues to function
          if (isMounted && auth0User.sub) {
            lastSyncedSubRef.current = auth0User.sub;
            setUser({
              id: auth0User.sub,
              username: auth0User.nickname || auth0User.name || '',
              firstName: auth0User.given_name || '',
              lastName: auth0User.family_name || '',
              email: auth0User.email || '',
              address: '',
              phoneNumber: '',
              isAdmin: adminStatus,
            });
            setIsAuthenticated(true);
            setIsAdmin(adminStatus);
          }
        } finally {
          isSyncingRef.current = false;
        }
      } else {
        if (isMounted) {
          lastSyncedSubRef.current = null;
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
          localStorage.removeItem('token');
        }
      }

      if (isMounted) {
        setIsLocalLoading(false);
      }
    };

    syncAuth();

    return () => {
      isMounted = false;
    };
  }, [auth0IsAuthenticated, auth0User, auth0IsLoading, getAccessTokenSilently, getIdTokenClaims, logout]);

  const login = async () => {
    if (isAuth0Configured()) {
      await loginWithRedirect();
    } else {
      console.warn('Auth0 is not yet configured. Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in client/.env');
      alert('Auth0 is not yet configured with your credentials. Please add them to client/.env');
    }
  };

  const register = async () => {
    if (isAuth0Configured()) {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup',
        }
      });
    } else {
      console.warn('Auth0 is not yet configured. Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in client/.env');
      alert('Auth0 is not yet configured with your credentials. Please add them to client/.env');
    }
  };

  const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
    return await UserService.getUserTransactions(userId);
  };

  const deleteUser = async (userId: string) => {
    await UserService.deleteUser(userId);
    logout();
  };

  const updateUser = async (userToUpdate: User) => {
    const result = await UserService.updateUser(userToUpdate);
    setUser(result);
    return true;
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
      isAuthenticated,
      isAdmin,
      isLoading: auth0IsLoading || isLocalLoading,
      auth0Error
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