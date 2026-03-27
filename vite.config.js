import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pagesのサブディレクトリ（/photo-map/）でファイルを正しく探せるようにします
  base: './', 
  build: {
    // ビルド後の出力先を明確にします
    outDir: 'dist',
  }
})