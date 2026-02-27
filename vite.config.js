import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), VitePluginSingleFile()],
  build: {
    rollupOptions: {
      output: { inlineDynamicImports: true }  // dla pełnej inlinizacji
    },
  server: { port: 5173 }
})
