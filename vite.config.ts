import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7030",
        changeOrigin: true,
        secure: false, // були трабли з self-signed сертифіками
      },
    },
  },
});
