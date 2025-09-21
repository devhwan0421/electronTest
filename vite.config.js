import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 중요 포인트
// 1) base: 빌드 때만 './' 로 설정해 file:// 로도 자원 로드되게 함
// 2) vueDevTools: 개발에서만 활성화 (패키지에 섞이면 노이즈)
// 3) server: 윈도우 + Electron 개발 편의를 위해 127.0.0.1:5173 고정

export default defineConfig(({ command, mode }) => ({
  base: command === 'build' ? './' : '/',   // ← 이 한 줄이 흰 화면의 주원인 해결
  plugins: [
    vue(),
    ...(mode === 'development' ? [vueDevTools()] : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
}))