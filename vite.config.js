import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 1. QUAN TRỌNG: Sửa lỗi trắng trang trên GitHub Pages
  base: '/WorldWords/', 
  
  build: {
    // 2. Xử lý cảnh báo tệp quá lớn bằng cách chia nhỏ các thư viện (vendor chunks)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    // Tăng giới hạn cảnh báo kích thước tệp lên 1000kB nếu cần
    chunkSizeWarningLimit: 1000,
  }
})