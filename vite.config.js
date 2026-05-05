import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@core": path.resolve(__dirname, "./src/js/core"),
    },
  },

  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        overview: path.resolve(__dirname, "overview.html"),
        profile: path.resolve(__dirname, "profile.html"),
        schedule: path.resolve(__dirname, "schedule.html"),
        team: path.resolve(__dirname, "team.html"),
        construction: path.resolve(__dirname, "construction.html"),
      },
    },
  },
});
