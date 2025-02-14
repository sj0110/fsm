import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  /* esbuild drop option specifies which statements to remove during the build process. By setting it to ['console'], all console statements (console.log, console.error, etc.) will be omitted from the production build.*/
  esbuild: {
    drop: ['console'],
  },
})
