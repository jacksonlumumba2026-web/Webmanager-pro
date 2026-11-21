import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Must match the GitHub repository name exactly (case-sensitive).
  // The site will live at https://jacksonlumumba2026-web.github.io/Webmanager-pro/
  base: "/Webmanager-pro/",
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
  server: {
    port: 5173,
  },
});
