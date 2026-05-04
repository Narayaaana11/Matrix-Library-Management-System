import axios from 'axios';
import { API_URL } from './config';
import { handleApiError, clearAuthData } from './utils';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token might be expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token available, logout user
          clearAuthData();
          window.location.href = '/auth/sign-in';
          return Promise.reject(error);
        }

        // Attempt to refresh token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken
        });

        if (response.data?.data?.accessToken) {
          const newToken = response.data.data.accessToken;
          localStorage.setItem('token', newToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed, logout user
        clearAuthData();
        window.location.href = '/auth/sign-in';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default apiClient;
