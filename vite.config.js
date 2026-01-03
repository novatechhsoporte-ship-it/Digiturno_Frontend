import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "@/styles/main.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@views": path.resolve(__dirname, "./src/views"),
      "@schemas": path.resolve(__dirname, "./src/schemas"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@core": path.resolve(__dirname, "./src/core"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
