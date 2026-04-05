import { useState, useCallback } from "react";
import { generateImage, fetchGallery } from "../services/api";

export function useGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  const generate = useCallback(async (prompt) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateImage(prompt);
      const imageUrl = data.imageUrl || data.image;
      const normalized = { ...data, image: data.image || imageUrl, imageUrl };
      setResult(normalized);
      setGallery((prev) => [
        {
          id: data.id,
          prompt,
          enhancedPrompt: data.enhancedPrompt,
          image: data.image || imageUrl,
          imageUrl,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      if (err.response?.status === 500 && err.response.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const errorData = JSON.parse(text);
          setError(errorData.error);
        } catch {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError(err.response?.data?.error || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGallery = useCallback(async () => {
    setGalleryLoading(true);
    try {
      const data = await fetchGallery();
      setGallery(data.map((item) => ({ ...item, image: item.image || item.imageUrl, imageUrl: item.imageUrl || item.image })));
    } catch {
      setGallery([]);
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  return { loading, error, result, gallery, galleryLoading, generate, loadGallery };
}
