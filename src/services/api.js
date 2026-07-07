import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

// This interceptor runs before every request and adds the JWT when a user is logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("farmconnect_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
