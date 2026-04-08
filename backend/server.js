require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
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

const MAX_PROMPT_LENGTH = 1000;
const MAX_GALLERY_ITEMS = 20;

app.get("/", (_req, res) => {
  res.send("Server is running");
});

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

const gallery = [];

async function enhancePrompt(prompt) {
  if (!process.env.GOOGLE_API_KEY) {
    return prompt;
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
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

app.get("/gallery", (_req, res) => {
  res.json(gallery);
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const enhancedPrompt = await enhancePrompt(prompt);

  try {
    console.log("Using model: black-forest-labs/FLUX.1-schnell");
    const response = await axios({
      url: "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "image/png",
      },
      data: {
        inputs: enhancedPrompt || prompt,
        options: {
          wait_for_model: true,
        },
      },
      responseType: "arraybuffer",
      timeout: 120000,
    });

    if (response.headers["content-type"].includes("application/json")) {
      const error = JSON.parse(response.data.toString());
      return res.status(500).json({ error });
    }

    const image = Buffer.from(response.data, "binary").toString("base64");
    const payload = {
      image: `data:image/png;base64,${image}`,
      imageUrl: `data:image/png;base64,${image}`,
      id: Date.now(),
      prompt,
      enhancedPrompt,
      source: "huggingface",
    };

    storeGalleryItem(payload);
    res.json(payload);

  } catch (err) {
    console.error("HF ERROR:", err.response?.status, err.response?.data);
    console.error("HF API Error:", err.response?.status);
    console.error("HF API Response:", err.response?.data?.toString());
    const fallback = {
      image: buildFallbackImage(prompt),
      imageUrl: buildFallbackImage(prompt),
      id: Date.now(),
      prompt,
      enhancedPrompt,
      source: "fallback",
    };
    storeGalleryItem(fallback);
    return res.json(fallback);
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server running");
});
