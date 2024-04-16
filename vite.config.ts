import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: "terser",
  },
  server: {
    host: "0.0.0.0",
  },
});
