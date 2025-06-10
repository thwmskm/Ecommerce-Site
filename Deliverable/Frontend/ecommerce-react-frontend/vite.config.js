// File: vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    proxy: {
      "/api": process.env.REACT_APP_BACKEND_URL,
      "/auth": process.env.REACT_APP_BACKEND_URL,
      "/checkout": process.env.REACT_APP_BACKEND_URL,
    },
  },
});
