<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-grid">
        <!-- 服務資訊 -->
        <div class="footer-column">
          <h3 class="footer-heading">Service</h3>
          <div class="footer-links">
            <div class="footer-link">
              <i class="bi bi-envelope-fill"></i>
              <span>service@bolbydigital.com.tw</span>
            </div>
            <div class="footer-link">
              <i class="bi bi-telephone-fill"></i>
              <span>+886 2 8787-0857</span>
            </div>
            <router-link to="/backstage" class="footer-link admin-link">
              <i class="bi bi-shield-lock-fill"></i>
              <span>登入管理</span>
            </router-link>
          </div>
        </div>

        <!-- 社群媒體 -->
        <div class="footer-column">
          <h3 class="footer-heading">Follow</h3>
          <div class="social-links">
            <a href="#" class="social-icon instagram" aria-label="Instagram">
              <i class="bi bi-instagram"></i>
              <span class="icon-bg"></span>
            </a>
            <a href="#" class="social-icon twitter" aria-label="Twitter">
              <i class="bi bi-twitter-x"></i>
              <span class="icon-bg"></span>
            </a>
            <a href="#" class="social-icon threads" aria-label="Threads">
              <i class="bi bi-threads"></i>
              <span class="icon-bg"></span>
            </a>
            <a href="#" class="social-icon facebook" aria-label="Facebook">
              <i class="bi bi-facebook"></i>
              <span class="icon-bg"></span>
            </a>
            <a href="#" class="social-icon youtube" aria-label="YouTube">
              <i class="bi bi-youtube"></i>
              <span class="icon-bg"></span>
            </a>
          </div>
        </div>

        <!-- 訂閱電子報 -->
        <div class="footer-column newsletter-column">
          <h3 class="footer-heading">Newsletter</h3>
          <form class="newsletter-form" @submit.prevent="subscribe">
            <div class="input-wrapper">
              <input type="email" class="newsletter-input" placeholder="輸入 Email 訂閱電子報" aria-label="Email"
                v-model="emailInput">
              <button type="submit" class="newsletter-btn">
                <span>訂閱</span>
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
            <p class="newsletter-note">訂閱電子報可收到優惠訊息以及最新產品資訊。</p>
          </form>
        </div>
      </div>

      <!-- 版權資訊 -->
      <div class="footer-bottom">
        <div class="copyright">
          <p>© 2026 Bolby Digital Inc. ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </div>

    <!-- 裝飾元素 -->
    <div class="footer-decoration">
      <div class="deco-circle circle-1"></div>
      <div class="deco-circle circle-2"></div>
      <div class="deco-circle circle-3"></div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from '../composable/useToast';

const emailInput = ref('')
const subscribe = () => {
  if (emailInput.value.trim()) {
    showToast('訂閱成功！感謝您的支持！', 'success')
    emailInput.value = ''
  } else {
    showToast('請輸入有效的電子郵件地址！', 'error')
  }
}
</script>

<style lang="scss" scoped>
// 設計系統變數
$primary: #7030a0;
$secondary: #a855f7;
$dark-1: #0f172a;
$dark-2: #1e293b;
$dark-3: #334155;
$text-light: #94a3b8;
$text-lighter: #cbd5e1;

// 動畫時長
$transition-fast: 0.2s;
$transition-base: 0.3s;
$transition-slow: 0.5s;

.site-footer {
  position: relative;
  background: linear-gradient(180deg,
      $dark-1 0%,
      $dark-2 50%,
      $dark-1 100%);
  overflow: hidden;

  // 頂部漸層邊框
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg,
        transparent,
        $primary 20%,
        $secondary 50%,
        $primary 80%,
        transparent);
    background-size: 200% 100%;
    animation: gradient-flow 8s ease infinite;
  }

  // 頂部光暈效果
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 200px;
    background: radial-gradient(ellipse at center,
        rgba($secondary, 0.15),
        transparent 70%);
    filter: blur(60px);
    pointer-events: none;
  }
}

.footer-content {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 5rem 2rem 2rem;
}

// 網格布局
.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 4rem;
  margin-bottom: 4rem;
}

.footer-column {
  position: relative;
}

// 標題樣式
.footer-heading {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  &::before {
    content: '';
    position: absolute;
    bottom: -0.75rem;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, $primary, $secondary);
    border-radius: 2px;
    box-shadow: 0 0 20px rgba($secondary, 0.5);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -0.75rem;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, $secondary, $primary);
    border-radius: 2px;
    animation: underline-glow 3s ease infinite;
    opacity: 0;
  }
}

// 連結樣式
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: $text-light;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  transition: all $transition-base cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  i {
    font-size: 1.125rem;
    color: $secondary;
    transition: all $transition-base;
  }

  span {
    position: relative;
    z-index: 2;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba($primary, 0.1), rgba($secondary, 0.1));
    opacity: 0;
    transition: opacity $transition-base;
  }

  &:hover {
    color: white;
    border-color: rgba($secondary, 0.3);
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(8px);
    box-shadow:
      0 4px 20px rgba($primary, 0.2),
      0 0 0 1px rgba($secondary, 0.2) inset;

    i {
      color: $secondary;
      transform: scale(1.2) rotate(5deg);
    }

    &::before {
      opacity: 1;
    }
  }
}

.admin-link {
  margin-top: 0.5rem;
  background: linear-gradient(135deg, rgba($primary, 0.15), rgba($secondary, 0.1));
  border-color: rgba($secondary, 0.2);

  &:hover {
    background: linear-gradient(135deg, rgba($primary, 0.25), rgba($secondary, 0.2));
    border-color: $secondary;
  }
}

// 社群圖標
.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-icon {
  position: relative;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.4rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all $transition-base cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  i {
    position: relative;
    z-index: 2;
    transition: all $transition-base;
  }

  .icon-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, $primary, $secondary);
    opacity: 0;
    transition: opacity $transition-base;
  }

  &:hover {
    transform: translateY(-8px) scale(1.05);
    border-color: $secondary;
    box-shadow:
      0 8px 30px rgba($primary, 0.4),
      0 0 40px rgba($secondary, 0.3);

    i {
      transform: rotateY(360deg) scale(1.1);
    }

    .icon-bg {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-6px) scale(1);
  }

  // 個別顏色
  &.instagram:hover {
    box-shadow:
      0 8px 30px rgba(225, 48, 108, 0.4),
      0 0 40px rgba(253, 29, 29, 0.3);
  }

  &.twitter:hover,
  &.threads:hover {
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.6),
      0 0 40px rgba(255, 255, 255, 0.2);
  }

  &.facebook:hover {
    box-shadow:
      0 8px 30px rgba(24, 119, 242, 0.4),
      0 0 40px rgba(66, 103, 178, 0.3);
  }

  &.youtube:hover {
    box-shadow:
      0 8px 30px rgba(255, 0, 0, 0.4),
      0 0 40px rgba(255, 0, 0, 0.3);
  }
}

// 訂閱表單
.newsletter-column {
  grid-column: span 1;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  gap: 0.5rem;
}

.newsletter-input {
  flex: 1;
  padding: 1.125rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: white;
  font-size: 1rem;
  outline: none;
  backdrop-filter: blur(10px);
  transition: all $transition-base;

  &::placeholder {
    color: $text-light;
  }

  &:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: $secondary;
    box-shadow:
      0 0 0 4px rgba($secondary, 0.15),
      0 8px 30px rgba($primary, 0.2);
  }
}

.newsletter-btn {
  padding: 1.125rem 2rem;
  background: linear-gradient(135deg, $primary, $secondary);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all $transition-base cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 20px rgba($primary, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  position: relative;
  overflow: hidden;

  i {
    font-size: 1.25rem;
    transition: transform $transition-base;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, $secondary, $primary);
    opacity: 0;
    transition: opacity $transition-base;
  }

  span,
  i {
    position: relative;
    z-index: 2;
  }

  &:hover {
    transform: translateX(4px);
    box-shadow:
      0 6px 30px rgba($primary, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.2) inset;

    i {
      transform: translateX(4px);
    }

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateX(2px) scale(0.98);
  }
}

.newsletter-note {
  font-size: 0.875rem;
  color: $text-light;
  line-height: 1.6;
  margin: 0;
}

// 底部版權
.footer-bottom {
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 1px;
    background: linear-gradient(90deg,
        transparent,
        $secondary,
        transparent);
  }
}

.copyright {
  text-align: center;
  padding: 2rem 0;

  p {
    color: $text-light;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
    margin: 0;
    font-weight: 500;
  }
}

// 裝飾元素
.footer-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: float 20s ease-in-out infinite;
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, $primary, transparent);
  top: 10%;
  right: -10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, $secondary, transparent);
  bottom: 20%;
  left: -5%;
  animation-delay: 7s;
}

.circle-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, $primary, transparent);
  top: 60%;
  right: 15%;
  animation-delay: 14s;
}

// 動畫
@keyframes gradient-flow {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@keyframes underline-glow {

  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translate(0, 0);
  }

  25% {
    transform: translate(30px, -30px);
  }

  50% {
    transform: translate(-20px, 20px);
  }

  75% {
    transform: translate(40px, 10px);
  }
}

// 響應式設計
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }

  .newsletter-column {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .site-footer {
    margin-top: 4rem;
  }

  .footer-content {
    padding: 3rem 1.5rem 1.5rem;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
  }

  .newsletter-column {
    grid-column: span 1;
  }

  .footer-heading {
    font-size: 1.25rem;
  }

  .input-wrapper {
    flex-direction: column;
  }

  .newsletter-btn {
    width: 100%;
    justify-content: center;
  }

  .social-links {
    justify-content: flex-start;
  }

  .social-icon {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }

  .footer-bottom {
    padding-top: 2rem;
  }

  .copyright {
    padding: 1.5rem 0;

    p {
      font-size: 0.8rem;
    }
  }
}

@media (max-width: 480px) {
  .footer-content {
    padding: 2rem 1rem 1rem;
  }

  .footer-link {
    font-size: 0.9rem;
    padding: 0.625rem 0.875rem;

    i {
      font-size: 1rem;
    }
  }

  .social-icon {
    width: 44px;
    height: 44px;
    font-size: 1.125rem;
  }
}
</style>