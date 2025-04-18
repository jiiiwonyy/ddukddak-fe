import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
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
