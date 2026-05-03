import { useState, useCallback, useEffect, useRef } from "react";
import { generateImage, fetchGallery } from "../services/api";

export function useGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const activeObjectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (activeObjectUrlRef.current) {
        URL.revokeObjectURL(activeObjectUrlRef.current);
      }
    };
  }, []);

  const generate = useCallback(async (prompt) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateImage(prompt);
      if (activeObjectUrlRef.current) {
        URL.revokeObjectURL(activeObjectUrlRef.current);
        activeObjectUrlRef.current = null;
      }

      const imageUrl = data.imageUrl || data.image;
      if (typeof imageUrl === "string" && imageUrl.startsWith("blob:")) {
        activeObjectUrlRef.current = imageUrl;
      }

      const normalized = {
        ...data,
        id: data.id || Date.now(),
        prompt: data.prompt || prompt,
        image: data.image || imageUrl,
        imageUrl,
      };
      setResult(normalized);
      setGallery((prev) => [
        {
          id: normalized.id,
          prompt,
          enhancedPrompt: data.enhancedPrompt,
          image: normalized.image,
          imageUrl,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
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
