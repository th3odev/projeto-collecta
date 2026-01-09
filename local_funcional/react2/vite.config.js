import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/react2/',  // or /react2/
  build: {
    rollupOptions: {
      external: [/^\/jsApiLayer/]
    }
  }


  //server: {
   // port: 5173,
    //open: true
  //}
})
