import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The API server runs on :4000. Proxy /api and /storage in dev so the client
// can use same-origin relative URLs that also work in the production build.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:4000", changeOrigin: true },
      "/storage": { target: "http://localhost:4000", changeOrigin: true },
    },
  },
});
