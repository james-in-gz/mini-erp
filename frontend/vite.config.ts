import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 让 @ 指向 src
    },
  },
  // 关键：代理配置
  server: {
    proxy: {
      // 把 /api 开头的请求转发到 Go 后端
      '/api': {
        target: 'http://localhost:8080', // Go 运行地址
        changeOrigin: true,             // 必须加，解决跨域
        secure: false,                  // 本地 http 不用加密
      },
    },
  },
})
