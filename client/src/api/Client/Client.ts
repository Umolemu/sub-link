import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_API as string;

export const Client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

Client.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function extractErrorMessage(e: unknown, fallback = "Request failed") {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as any;
    if (data?.error) return data.error;
    if (typeof data === "string") return data;
  }
  return fallback;
}
