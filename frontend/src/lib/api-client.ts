import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./constants";
import { getStoredToken, clearAuth } from "./auth";

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global 401s and Standardize Error Messages
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      // If unauthorized and not already on the login page, clear auth and redirect
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        clearAuth();
        window.location.href = "/login?session=expired";
      }
    }

    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "An unexpected server error occurred.";

    return Promise.reject(new Error(errorMessage));
  }
);
