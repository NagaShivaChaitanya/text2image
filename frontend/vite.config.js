import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/generate": "https://text2image-1-ox70.onrender.com",
      "/gallery": "https://text2image-1-ox70.onrender.com",
    },
  },
});
