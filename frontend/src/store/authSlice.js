import axios from "axios";

const api = axios.create({
  baseURL: "https://wanderguide-backend.onrender.com/api",
  withCredentials: true, // ⭐ VERY IMPORTANT (sends cookies)
});

// Flag to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

// Process queued requests after token refresh
const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {

      // If already refreshing → queue requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh API
        await api.post("/auth/refresh");

        processQueue(null);
        isRefreshing = false;

        // Retry original request
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        // Optional: redirect to login
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
