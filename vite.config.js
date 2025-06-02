import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // __dirname처럼 사용
// https://vite.dev/config/

export default defineConfig({
  server: {
    host: true,
    port: 5174,
    strictPort: true, // 포트가 사용 중이면 서버 시작 실패
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "localhost+2-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "localhost+2.pem")),
    },
    hmr: false,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
        "icons/*.png",
      ],
      manifest: {
        name: "Ddukddak App",
        short_name: "Ddukddak",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        icons: [
          {
            src: "/icons/pwa-icon-48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/icons/pwa-icon-72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/icons/pwa-icon-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/icons/pwa-icon-144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/icons/pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
