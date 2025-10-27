// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // ИСПРАВЛЕНИЕ: Добавление прокси для обхода CORS и устранения 404
    proxy: {
      '/api': {
        target: 'http://185.13.47.146:50123',
        changeOrigin: true,
      },
      '/vacancies': {
        target: 'http://185.13.47.146:50123',
        changeOrigin: true,
      },
      // НОВОЕ ПРАВИЛО: Проксирование запросов на загрузку файлов
      '/files': {
        target: 'http://185.13.47.146:50123',
        changeOrigin: true,
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));