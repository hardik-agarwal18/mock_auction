import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only auto-redirect to login on 401 if not already on login/register pages
    // and not during login/register requests
    const isAuthRequest =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register");

    if (error.response?.status === 401 && !isAuthRequest) {
      const currentPath = window.location.pathname;
      const isPublicPage =
        currentPath === "/login" ||
        currentPath === "/register" ||
        currentPath === "/";

      if (!isPublicPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    // Format error message properly
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    const formattedError = new Error(errorMessage);
    formattedError.response = error.response;
    formattedError.status = error.response?.status;

    return Promise.reject(formattedError);
  },
);

export default axiosInstance;
