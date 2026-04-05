import axios from "axios";

const api = axios.create({ baseURL: "https://text2image-1-ox70.onrender.com" });

export const generateImage = async (prompt) => {
  const res = await api.post("/generate", { prompt });
  return res.data;
};

export const fetchGallery = async () => {
  const res = await api.get("/gallery");
  return res.data;
};
