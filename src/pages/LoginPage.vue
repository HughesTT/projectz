<template>
  <div class="login-page">
    <!-- 左側品牌展示區 -->
    <div class="brand-section">
      <div class="brand-content">
        <div class="brand-logo">
          <img src="../../public/img/logo.2dcc836c.png" alt="Logo">
        </div>
        <h1 class="brand-title">Welcome</h1>
        <p class="brand-description">登入以享受最優質的影音體驗</p>
        <div class="brand-features">
          <div class="feature-item">
            <i class="bi bi-shield-check"></i>
            <span>安全交易</span>
          </div>
          <div class="feature-item">
            <i class="bi bi-truck"></i>
            <span>快速到貨</span>
          </div>
          <div class="feature-item">
            <i class="bi bi-headphones"></i>
            <span>專業客服</span>
          </div>
        </div>
      </div>
      <div class="brand-overlay"></div>
    </div>

    <!-- 右側登入表單區 -->
    <div class="form-section">
      <div class="form-container">
        <LoginForm :modelValue="user" :loading="loading" @submit="handleLogin" />
      </div>
    </div>
    <!-- 返回首頁按鈕 -->

    <router-link to="/" class="backhome-link">
      <div class="backhome">
        <i class="bi bi-house-door"></i>
        回到首頁
      </div>
    </router-link>
  </div>
  <ToastPage />
</template>

<script setup>
import LoginForm from '../components/member/LoginForm.vue'
import ToastPage from '../components/backstage/ToastPage.vue'
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  background: #f8f9fa;
}

.backhome {
  position: fixed;
  top: 1rem;
  right: 0.3rem;
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background 0.3s ease-in-out;

  .backhome-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    text-decoration: none;
    font-weight: 500;

    i {
      font-size: 1.2rem;
    }
  }

  &:hover {
    background: #5a67d8;
  }
}

/* 左側品牌展示區 */
.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 15s ease-in-out infinite;
  }

  @media (max-width: 992px) {
    display: none;
  }
}

.brand-overlay {
  position: absolute;
  inset: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.brand-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  max-width: 500px;
}

.brand-logo {
  margin-bottom: 2rem;

  img {
    height: 100px;
    filter: brightness(0) invert(1);
    animation: fadeInUp 1s ease;
  }
}

.brand-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  animation: fadeInUp 1s ease 0.2s both;
}

.brand-description {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  animation: fadeInUp 1s ease 0.4s both;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeInUp 1s ease 0.6s both;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;

  i {
    font-size: 1.5rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.75rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }
}

/* 右側表單區 */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
}

.form-container {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: slideInRight 0.6s ease;

  @media (max-width: 576px) {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }
}

/* 動畫 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  50% {
    transform: translate(20px, 20px) rotate(180deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}
</style>