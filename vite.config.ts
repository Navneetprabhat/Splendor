import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        index: "src/main.tsx",
      },
      output: {
        entryFileNames: "assets/index.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (assetInfo) =>
          assetInfo.name && assetInfo.name.indexOf(".css") >= 0
            ? "assets/index.css"
            : "assets/[name][extname]",
      },
    },
  },
  plugins: [react()],
});
