import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

async function blobToObjectUrl(blob) {
  return URL.createObjectURL(blob);
}

async function normalizeImageResponse(responseBlob) {
  const contentType = responseBlob.type || "";

  if (contentType.startsWith("image/")) {
    const imageUrl = await blobToObjectUrl(responseBlob);
    return { imageUrl, image: imageUrl, contentType };
  }

  const responseText = await responseBlob.text();

  try {
    const data = JSON.parse(responseText);
    const imageSource = data.imageUrl || data.image || "";

    if (!imageSource) {
      throw new Error(data.error || "Image generation failed");
    }

    if (typeof imageSource === "string" && imageSource.startsWith("blob:")) {
      return { ...data, imageUrl: imageSource, image: imageSource };
    }

    if (typeof imageSource === "string" && imageSource.startsWith("data:")) {
      const imageResponse = await fetch(imageSource);
      const imageBlob = await imageResponse.blob();
      const objectUrl = await blobToObjectUrl(imageBlob);
      return { ...data, imageUrl: objectUrl, image: objectUrl };
    }

    return { ...data, imageUrl: imageSource, image: imageSource };
  } catch {
    throw new Error(responseText || "Image generation failed");
  }
}

export const generateImage = async (prompt) => {
  const res = await api.post("/generate", { prompt }, { responseType: "blob" });
  return normalizeImageResponse(res.data);
};

export const fetchGallery = async () => {
  const res = await api.get("/gallery");
  return res.data;
};
