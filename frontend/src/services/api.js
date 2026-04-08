import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3001"
    : "https://text2image-1-ox70.onrender.com");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

export const generateImage = async (prompt) => {
  const res = await api.post("/generate", { prompt });
  return res.data;
};

export const fetchGallery = async () => {
  const res = await api.get("/gallery");
  return res.data;
};
