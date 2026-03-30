import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // Don't retry refresh requests or already retried requests
    if (
      err.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/refresh') &&
      !original.url?.includes('/auth/me')
    ) {
      if (isRefreshing) return Promise.reject(err);
      original._retry = true;
      isRefreshing = true;
      try {
        await api.post('/auth/refresh');
        isRefreshing = false;
        return api(original);
      } catch {
        isRefreshing = false;
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
