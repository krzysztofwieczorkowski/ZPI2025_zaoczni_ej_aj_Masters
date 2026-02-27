import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile  } from 'vite-plugin-singlefile'

export default defineConfig({
    base: './',
    build: {
        assetsDir: '',
        sourcemap: false,
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
                manualChunks: undefined
            }
        }
    },
    plugins: [
        react(),
        viteSingleFile()
    ],
    server: { port: 5173 }
})
