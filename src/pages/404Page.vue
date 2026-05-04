<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-number">
        <span class="number-4">4</span>
        <span class="number-0">
          <i class="bi bi-0-circle"></i>
        </span>
        <span class="number-4">4</span>
      </div>

      <h1 class="error-title">Oops！找不到這個頁面</h1>
      <p class="error-subtitle">
        看來這個頁面戴著我們的降噪耳機，<br>
        阻擋了所有訊號...
      </p>

      <div class="icon-decoration">
        <i class="bi bi-emoji-dizzy floating"></i>
      </div>

      <div class="action-buttons">
        <router-link to="/" class="btn-home">
          <i class="bi bi-house-door-fill"></i>
          回到首頁
        </router-link>
        <router-link to="/products/headphone" class="btn-products">
          <i class="bi bi-headphones"></i>
          逛逛產品
        </router-link>
      </div>
    </div>

    <!-- 背景裝飾 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 頁面標題
  document.title = '404 - 頁面不存在 | ProjectZ'
})
</script>

<style lang="scss" scoped>
$primary: #7030a0;
$secondary: #a855f7;
$dark: #1a202c;
$light: #f7fafc;
$white: #ffffff;

.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.error-container {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 600px;
}

// 404 数字样式
.error-number {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  font-size: clamp(4rem, 15vw, 8rem);
  font-weight: 900;

  .number-4 {
    background: linear-gradient(135deg, $primary, $secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: pulse 2s ease-in-out infinite;
  }

  .number-0 {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    // animation: rotate 3s linear infinite;

    i {
      margin-top: 0;
      font-size: 7rem;
      color: $primary;
      display: block;
    }
  }
}

// 标题样式
.error-title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: $dark;
  margin-bottom: 1rem;
  animation: slideUp 0.8s ease-out;
}

.error-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 2rem;
  animation: slideUp 0.8s ease-out 0.2s both;
}

// 装饰图标
.icon-decoration {
  margin: 2rem 0;
  animation: slideUp 0.8s ease-out 0.4s both;

  i {
    font-size: 4rem;
    color: $secondary;
    animation: floating 3s ease-in-out infinite;
  }
}

// 按钮组
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  animation: slideUp 0.8s ease-out 0.6s both;

  a {
    padding: 1rem 2rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1.1rem;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    i {
      font-size: 1.2rem;
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
    }
  }

  .btn-home {
    background: linear-gradient(135deg, $primary, $secondary);
    color: white;

    &:hover {
      background: linear-gradient(135deg, darken($primary, 5%), darken($secondary, 5%));
    }
  }

  .btn-products {
    background: white;
    color: $primary;
    border: 2px solid $primary;

    &:hover {
      background: $primary;
      color: white;
    }
  }
}

// 底部提示
.error-hint {
  font-size: 0.95rem;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  animation: slideUp 0.8s ease-out 0.8s both;

  i {
    color: $secondary;
    font-size: 1.1rem;
  }
}

// 背景装饰圆圈
.bg-decoration {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba($primary, 0.1), rgba($secondary, 0.1));
    animation: float 20s ease-in-out infinite;
  }

  .circle-1 {
    width: 300px;
    height: 300px;
    top: -150px;
    left: -150px;
    animation-delay: 0s;
  }

  .circle-2 {
    width: 200px;
    height: 200px;
    bottom: -100px;
    right: -100px;
    animation-delay: 5s;
  }

  .circle-3 {
    width: 150px;
    height: 150px;
    top: 50%;
    right: 10%;
    animation-delay: 10s;
  }
}

// 动画定义
@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes floating {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .error-page {
    padding: 1rem;
  }

  .error-number {
    gap: 0.5rem;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin: 0 auto 2rem;

    a {
      width: 100%;
      justify-content: center;
    }
  }

  .error-hint {
    font-size: 0.85rem;
    padding: 0 1rem;
  }
}
</style>