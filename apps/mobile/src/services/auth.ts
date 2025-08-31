import { API_ENDPOINTS } from '../constants/api';
import { apiClient } from './api';
import { User } from '@bamboo/shared';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

class AuthService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearToken() {
    this.token = null;
    delete apiClient.defaults.headers.common['Authorization'];
  }

  getToken(): string | null {
    return this.token;
  }

  async login(email: string, password: string) {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        { email, password }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  }

  async register(email: string, password: string, name: string) {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        { email, password, name }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Token refresh failed',
      };
    }
  }

  async logout() {
    try {
      if (this.token) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
      this.clearToken();
      return { success: true };
    } catch (error: any) {
      // Even if logout fails on server, clear local token
      this.clearToken();
      return {
        success: false,
        error: error.response?.data?.message || 'Logout failed',
      };
    }
  }

  async forgotPassword(email: string) {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send reset email',
      };
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password,
      });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Password reset failed',
      };
    }
  }

  async verifyEmail(token: string) {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Email verification failed',
      };
    }
  }

  async resendVerification(email: string) {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to resend verification',
      };
    }
  }

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Password change failed',
      };
    }
  }
}

export const authService = new AuthService();