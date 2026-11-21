import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deploy on Vercel (base "/"). Client-side routes are handled by vercel.json.
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: { outDir: "dist", sourcemap: false, chunkSizeWarningLimit: 1200 },
});
