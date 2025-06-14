import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    mkcert(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },
      workbox: {
        cleanupOutdatedCaches: false,
      },
      manifest: {
        name: "Polly",
        short_name: "Polly",
        gcm_sender_id: "1047611297686",
        icons: [
          {
            src: "/logo-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/logo-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/logo-180.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/logo-120.png",
            sizes: "120x120",
            type: "image/png",
            purpose: "any",
          },
        ],
        display: "standalone",
        orientation: "portrait",
        background_color: "#000000",
        theme_color: "#b40000",
      },
    }),
  ],
});
