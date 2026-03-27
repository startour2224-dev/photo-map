import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // これがGitHub Pagesでの「パスのズレ」を直す魔法の一行です
})