import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Это для твоего API
      '/api': { 
        target: 'http://185.13.47.146:50123',
        changeOrigin: true,
      },
      // Это для файлов
      '/files': { 
        target: 'http://185.13.47.146:50123',
        changeOrigin: true,
      },

      // --- ГЛАВНОЕ ДЛЯ WEBSOCKET (Proxy) ---
      '/websocket/': { 
        target: 'ws://185.13.47.146:50123',
        changeOrigin: true,
        ws: true,
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
