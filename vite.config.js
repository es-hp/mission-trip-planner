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
        index: path.resolve(__dirname, "index.html"),
        profile: path.resolve(__dirname, "profile.html"),
        overview: path.resolve(__dirname, "overview.html"),
        team: path.resolve(__dirname, "team.html"),
        schedule: path.resolve(__dirname, "schedules.html"),
        finance: path.resolve(__dirname, "finance.html"),
        travelDetails: path.resolve(__dirname, "travel-details.html"),
        resources: path.resolve(__dirname, "resources.html"),
      },
    },
  },
});
