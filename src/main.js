import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// CSS 載入
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'

// 停止瀏覽器下拉到底觸發的葉面重新整理（特別是行動裝置）
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

const pinia = createPinia()

createApp(App)
.use(router)
.use(pinia)
.mount('#app')
