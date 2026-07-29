import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Imitación de Cristo",
        short_name: "Imitación de Cristo",
        description: "Lectura y meditación de la Imitación de Cristo, capítulo a capítulo.",
        lang: "es",
        start_url: "/",
        display: "standalone",
        background_color: "#fbf9f4",
        theme_color: "#7a5c3e",
        icons: [
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,json}"],
      },
    }),
  ],
});
