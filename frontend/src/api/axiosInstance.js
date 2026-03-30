import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,  // send cookies with every request
});

// Interceptor: auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await api.post('/auth/refresh');
        return api(original);  // retry original request
      } catch {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;