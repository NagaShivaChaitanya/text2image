import axios from "axios";

const api = axios.create({ baseURL: "" });

export const generateImage = async (prompt) => {
  const res = await axios.post("http://localhost:3001/generate", { prompt });
  return res.data;
};

export const fetchGallery = async () => {
  const res = await api.get("/gallery");
  return res.data;
};
