import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@bamboo/shared';
import { authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = '@bamboo_token';
const REFRESH_TOKEN_KEY = '@bamboo_refresh_token';
const USER_KEY = '@bamboo_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [token, refreshTokenValue, userData] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (token && refreshTokenValue && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Set the token in the auth service
        authService.setToken(token);
        
        // Try to refresh the token to ensure it's still valid
        const refreshSuccess = await refreshToken();
        if (!refreshSuccess) {
          await logout();
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      if (response.success && response.data) {
        const { user: userData, token, refreshToken } = response.data;
        
        // Store tokens and user data
        await Promise.all([
          AsyncStorage.setItem(TOKEN_KEY, token),
          AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
          AsyncStorage.setItem(USER_KEY, JSON.stringify(userData)),
        ]);
        
        setUser(userData);
        authService.setToken(token);
        
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const response = await authService.register(email, password, name);
      
      if (response.success && response.data) {
        const { user: userData, token, refreshToken } = response.data;
        
        // Store tokens and user data
        await Promise.all([
          AsyncStorage.setItem(TOKEN_KEY, token),
          AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
          AsyncStorage.setItem(USER_KEY, JSON.stringify(userData)),
        ]);
        
        setUser(userData);
        authService.setToken(token);
        
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || 'Registration failed',
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear stored data
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
      
      // Clear auth service token
      authService.clearToken();
      
      // Reset state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const storedRefreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (!storedRefreshToken) {
        return false;
      }
      
      const response = await authService.refreshToken(storedRefreshToken);
      
      if (response.success && response.data) {
        const { token, refreshToken: newRefreshToken, user: userData } = response.data;
        
        // Update stored tokens
        await Promise.all([
          AsyncStorage.setItem(TOKEN_KEY, token),
          AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken),
          AsyncStorage.setItem(USER_KEY, JSON.stringify(userData)),
        ]);
        
        setUser(userData);
        authService.setToken(token);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};