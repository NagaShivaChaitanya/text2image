require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { InferenceClient } = require("@huggingface/inference");

const app = express();
const HF_IMAGE_MODEL = process.env.HF_IMAGE_MODEL || "runwayml/stable-diffusion-v1-5";
const ENABLE_IMAGE_FALLBACK = (process.env.ENABLE_IMAGE_FALLBACK || "true") === "true";
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors(
    allowedOrigins.length
      ? {
          origin: allowedOrigins,
        }
      : undefined
  )
);
app.use(express.json());

const MAX_GALLERY_ITEMS = 20;

app.get("/", (_req, res) => {
  res.send("Server is running");
});

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

const gallery = [];
const hfClient = process.env.HF_API_KEY ? new InferenceClient(process.env.HF_API_KEY) : null;

async function enhancePrompt(prompt) {
  if (!process.env.GOOGLE_API_KEY) {
    return prompt;
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Rewrite this image prompt into a short, vivid, production-ready prompt for an image model. Keep the meaning, add useful visual detail, and return only the rewritten prompt:\n\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 256,
        },
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("").trim();
    return text || prompt;
  } catch (error) {
    console.error("Gemini API Error:", error.response?.status || error.message);
    return prompt;
  }
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildFallbackImage(prompt) {
  const shortPrompt = prompt.length > 110 ? `${prompt.slice(0, 107)}...` : prompt;
  const lines = shortPrompt.match(/.{1,32}(\s|$)/g) || [shortPrompt];
  const promptLines = lines
    .slice(0, 4)
    .map((line, index) => `<text x="72" y="${178 + index * 28}" font-family="Arial, sans-serif" font-size="20" fill="#e8e8f0">${escapeXml(line.trim())}</text>`)
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f1118" />
          <stop offset="100%" stop-color="#1b2130" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="28%" r="60%">
          <stop offset="0%" stop-color="#c8ff00" stop-opacity="0.22" />
          <stop offset="100%" stop-color="#c8ff00" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#bg)" />
      <rect width="1024" height="1024" fill="url(#glow)" />
      <circle cx="820" cy="230" r="120" fill="#c8ff00" fill-opacity="0.1" />
      <rect x="72" y="110" width="220" height="6" rx="3" fill="#c8ff00" />
      <text x="72" y="156" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#ffffff">Demo generation</text>
      ${promptLines}
      <text x="72" y="820" font-family="Arial, sans-serif" font-size="18" fill="#9ca3af">Hugging Face unavailable, local fallback shown for demo</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function storeGalleryItem(item) {
  gallery.unshift(item);
  if (gallery.length > MAX_GALLERY_ITEMS) {
    gallery.pop();
  }
}

function decodeImageError(err) {
  const data = err?.response?.data;
  if (!data) return err?.message || "Unknown error";

  if (Buffer.isBuffer(data)) {
    return data.toString("utf8");
  }

  if (typeof data === "string") {
    return data;
  }

  try {
    return JSON.stringify(data);
  } catch {
    return err?.message || "Unknown error";
  }
}

async function generatePublicImage(prompt) {
  const imageResponse = await axios.get(
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`,
    {
      responseType: "arraybuffer",
      timeout: 120000,
    }
  );

  const contentType = imageResponse.headers["content-type"] || "image/jpeg";
  const imageBase64 = Buffer.from(imageResponse.data, "binary").toString("base64");

  return {
    image: `data:${contentType};base64,${imageBase64}`,
    imageUrl: `data:${contentType};base64,${imageBase64}`,
    contentType,
  };
}

async function generateHfImage(prompt) {
  if (!hfClient) {
    throw new Error("HF_API_KEY missing");
  }

  const imageBlob = await hfClient.textToImage({
    model: HF_IMAGE_MODEL,
    inputs: prompt,
  });

  const buffer = Buffer.from(await imageBlob.arrayBuffer());
  const imageBase64 = buffer.toString("base64");

  return {
    image: `data:image/png;base64,${imageBase64}`,
    imageUrl: `data:image/png;base64,${imageBase64}`,
    contentType: "image/png",
  };
}

app.get("/gallery", (_req, res) => {
  res.json(gallery);
});

app.get("/generate", (_req, res) => {
  res.status(405).json({
    error: "Method not allowed",
    message: "Use POST /generate with JSON body: { \"prompt\": \"your prompt\" }",
  });
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const enhancedPrompt = await enhancePrompt(prompt);
  const promptToUse = enhancedPrompt || prompt;
  let hfErrorMessage = null;

  try {
    if (hfClient) {
      try {
        console.log("Generating image with Hugging Face...");
        const generated = await generateHfImage(promptToUse);
        const { image, imageUrl, contentType } = generated;

        const payload = {
          image,
          imageUrl,
          id: Date.now(),
          prompt,
          enhancedPrompt,
          source: "huggingface",
          model: HF_IMAGE_MODEL,
          contentType,
        };

        storeGalleryItem(payload);
        return res.json(payload);
      } catch (hfErr) {
        hfErrorMessage = decodeImageError(hfErr);
        console.error("Hugging Face generation failed:", hfErrorMessage);
        if (hfErrorMessage.toLowerCase().includes("credits") || hfErrorMessage.toLowerCase().includes("fal-ai")) {
          console.error("HF routed to fal-ai, credits required");
        }
      }
    } else {
      hfErrorMessage = "HF_API_KEY missing";
      console.error("Hugging Face generation failed:", hfErrorMessage);
    }

    if (!ENABLE_IMAGE_FALLBACK) {
      return res.status(502).json({
        error: "Hugging Face image generation failed",
        details: hfErrorMessage,
        source: "huggingface",
        model: HF_IMAGE_MODEL,
      });
    }

    console.warn("Falling back to Pollinations after HF failure");
    const generated = await generatePublicImage(promptToUse);

    const { image, imageUrl, contentType } = generated;

    const payload = {
      image,
      imageUrl,
      id: Date.now(),
      prompt,
      enhancedPrompt,
      source: "pollinations",
      model: "pollinations-ai",
      contentType,
      warning: hfErrorMessage || null,
    };

    storeGalleryItem(payload);
    return res.json(payload);
  } catch (err) {
    const errorMessage = decodeImageError(err);
    console.error("Image generation error:", errorMessage);
    const fallbackImage = buildFallbackImage(enhancedPrompt || prompt);
    const payload = {
      image: fallbackImage,
      imageUrl: fallbackImage,
      id: Date.now(),
      prompt,
      enhancedPrompt,
      source: "fallback",
      error: errorMessage,
    };

    storeGalleryItem(payload);
    return res.json(payload);
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server running");
});
