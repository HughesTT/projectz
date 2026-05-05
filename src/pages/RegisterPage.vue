<template>
  <div class="register-page">
    <!-- 左側品牌展示區 -->
    <div class="brand-section">
      <div class="brand-content">
        <router-link to="/" class="brand-logo-link">
          <div class="brand-logo">
            <img :src="logo" alt="Logo">
          </div>
        </router-link>
        <h1 class="brand-title">Join Us</h1>
        <p class="brand-description">開始探索優質的影音體驗</p>
        <div class="brand-features">
          <div class="feature-item">
            <i class="bi bi-gift"></i>
            <span>新會員優惠</span>
          </div>
          <div class="feature-item">
            <i class="bi bi-star"></i>
            <span>點數累積回饋</span>
          </div>
          <div class="feature-item">
            <i class="bi bi-bell"></i>
            <span>專屬活動通知</span>
          </div>
        </div>
      </div>
      <div class="brand-overlay"></div>
    </div>

    <!-- 右側註冊表單區 -->
    <div class="form-section">
      <div class="form-container">
        <RegisterForm />
      </div>
    </div>
    <!-- 返回首頁按鈕 -->
    <router-link to="/" class="back-home-btn">
      <i class="bi bi-house-door"></i>
      <span>回到首頁</span>
    </router-link>
  </div>
</template>

<script setup>
import RegisterForm from '../components/member/RegisterForm.vue'
import logo from '/img/logo.2dcc836c.png'
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  background: #f8f9fa;
}

/* 左側品牌展示區 */
.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #bb9cdf 0%, #a953b3 100%);
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
    left: -50%;
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

/* 返回首頁按鈕 */
.back-home-btn {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  color: #bb9cdf;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 100;
  backdrop-filter: blur(10px);

  i {
    font-size: 1.2rem;
  }

  &:hover {
    background: #bb9cdf;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(187, 156, 223, 0.3);
  }

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;

    span {
      display: none;
    }
  }
}

/* Logo 可點擊 */
.brand-logo-link {
  display: block;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
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
    transform: translate(-20px, -20px) rotate(-180deg);
  }
}
</style>
