import axios from "axios";

// Ambil URL Backend dari environment (atau default ke lokal)
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Interceptor untuk menyematkan Token Auth ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Pastikan saat login, token disimpan dengan key 'token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
