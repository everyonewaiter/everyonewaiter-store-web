import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  optimizeDeps: {
    include: ["pdfjs-dist"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // PDF.js worker 경로 해결
      "pdfjs-dist/build/pdf.worker.min.mjs": "pdfjs-dist/build/pdf.worker.min.mjs",
    },
  },
});
