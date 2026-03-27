import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // これだけで全てのパスが相対パスになり、404エラーを防げます
})