import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? Platform.OS === 'ios' 
    ? 'http://localhost:3001/api'
    : 'http://10.0.2.2:3001/api'
  : 'https://api.bamboo-innovation.com/api';

const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    try {
      const token = await AsyncStorage.getItem('@bamboo_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error getting token from storage:', error);
    }

    // Add request timestamp for debugging
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log('[API Request Data]', config.data);
      }
    }

    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    if (__DEV__) {
      console.error('[API Response Error]', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message,
      });
    }

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401) {
      try {
        // Try to refresh token
        const refreshToken = await AsyncStorage.getItem('@bamboo_refresh_token');
        if (refreshToken) {
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          if (refreshResponse.data.token) {
            // Update stored tokens
            await AsyncStorage.setItem('@bamboo_token', refreshResponse.data.token);
            if (refreshResponse.data.refreshToken) {
              await AsyncStorage.setItem('@bamboo_refresh_token', refreshResponse.data.refreshToken);
            }

            // Retry original request with new token
            if (error.config) {
              error.config.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
              return apiClient.request(error.config);
            }
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        await AsyncStorage.multiRemove([
          '@bamboo_token',
          '@bamboo_refresh_token',
          '@bamboo_user',
        ]);
        
        // You might want to emit an event here to redirect to login
        console.warn('Token refresh failed, user needs to login again');
      }
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.post<T>(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.put<T>(url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.patch<T>(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(url, config),
};

// Upload helper for file uploads
export const uploadFile = async (
  url: string,
  file: {
    uri: string;
    type: string;
    name: string;
  },
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: file.type,
    name: file.name,
  } as any);

  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        onProgress(Math.round(progress));
      }
    },
  });
};

// Network status helper
export const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default apiClient;