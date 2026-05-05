<script setup>
import logo from '/img/logo.2dcc836c.png'

defineProps({
  currentStep: {
    type: Number,
    required: true,
    default: 1
  }
})
</script>

<template>
  <div class="checkout-steps-wrapper">
    <!-- Logo 和回首頁連結 -->
    <div class="checkout-header">
      <router-link to="/" class="logo-link">
        <img :src="logo" alt="網站 Logo" class="site-logo">
      </router-link>
    </div>

    <!-- 結帳步驟 -->
    <div class="checkout-steps">
      <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
        <div class="step-number">
          <i v-if="currentStep > 1" class="bi bi-check-lg"></i>
          <span v-else>1</span>
        </div>
        <div class="step-info">
          <div class="step-title">填寫付款資料</div>
          <div class="step-description">輸入購買人與付款資訊</div>
        </div>
      </div>
      <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
      <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
        <div class="step-number">
          <i v-if="currentStep > 2" class="bi bi-check-lg"></i>
          <span v-else>2</span>
        </div>
        <div class="step-info">
          <div class="step-title">付款完成</div>
          <div class="step-description">確認訂單並完成付款</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$primary-color: #7030a0;

.checkout-steps-wrapper {
  width: 100%;
}

.checkout-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 1rem 1rem 1rem;
  background: white;
  border-radius: 12px 12px 0 0;
  margin-bottom: 0;
  border-bottom: 1px solid #e2e8f0;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.site-logo {
  height: 50px;
  width: auto;
  object-fit: contain;
}

.checkout-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 1rem;
  background: white;
  border-radius: 0 0 12px 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.step {
  display: flex;
  align-items: center;
  gap: 1rem;
  opacity: 0.5;
  transition: opacity 0.3s;

  &.active {
    opacity: 1;
  }

  &.completed {
    opacity: 1;

    .step-number {
      background: $primary-color;
      color: white;
    }
  }
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  background: $primary-color;
  color: #fff;
  transition: all 0.3s;

  i {
    font-size: 1.5rem;
  }
}

.step-info {
  text-align: left;
}

.step-title {
  font-weight: 600;
  font-size: 1rem;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.step-description {
  font-size: 0.875rem;
  color: #718096;
}

.step-line {
  width: 80px;
  height: 2px;
  background: #e2e8f0;
  transition: background 0.3s;

  &.completed {
    background: $primary-color;
  }
}

@media (max-width: 768px) {
  .site-logo {
    height: 40px;
  }

  .checkout-header {
    padding: 1rem;
  }

  .checkout-steps {
    flex-direction: column;
    gap: 1.5rem;
  }

  .step-line {
    width: 2px;
    height: 40px;
  }
}
</style>
