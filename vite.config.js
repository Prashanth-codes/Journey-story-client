import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000, // Use the PORT environment variable
    host: true, // Set to true to bind to 0.0.0.0
  },
});
