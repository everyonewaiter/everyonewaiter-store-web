import { Mutex } from "async-mutex";
import axios from "axios";

const mutex = new Mutex();

export const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isLoginPage = window.location.pathname === "/login";

    if (error.response?.status === 401 && !isLoginPage) {
      await mutex.runExclusive(async () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
    }
    return Promise.reject(error);
  }
);

export const publicInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});
