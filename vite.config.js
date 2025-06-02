import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // https 옵션 개발환경에서만 세팅
  const isDev = mode === "development";
  let https = false;
  if (isDev) {
    https = {
      key: fs.readFileSync(path.resolve(__dirname, "localhost+2-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "localhost+2.pem")),
    };
  }

  return {
    server: {
      host: true,
      port: 5174,
      strictPort: true,
      https, // 개발때만 https 세팅, 배포 때는 false
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
  };
});
