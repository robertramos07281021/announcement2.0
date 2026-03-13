import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ["react", "react-dom"], // <--- important
  },
  server: {
    proxy: {
      "/graphql": {
        target: "http://localhost:5000",
        changeOrigin: true,
        ws: true,
      },
      "/upload": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
    hmr: {
      protocol: "wss",
    },
  },
});
