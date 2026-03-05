import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@utils": path.resolve(__dirname, "./src/js/core/utils.js"),
    },
  },
});
