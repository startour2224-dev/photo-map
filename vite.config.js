import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/photo-map/', // ← ここにリポジトリ名を入れる！
})