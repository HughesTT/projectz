<template>
  <div class="service-section">
    <div class="service-header">
      <p class="section-subtitle"><i class="bi bi-star-fill"></i>讓您購物更安心，享受完善的售後服務<i class="bi bi-star-fill"></i></p>

    </div>
    <div class="service-cards-container">
      <div class="service-card" v-for="service in services" :key="service.id">
        <div class="service-icon">
          <i :class="service.icon"></i>
        </div>
        <div class="service-content">
          <h3 class="service-title">{{ service.title }}</h3>
          <p class="service-description">{{ service.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const services = [
  {
    id: 1,
    icon: 'bi bi-shield-check',
    title: '延長保固',
    description: '部分商品享延長保固服務'
  },
  {
    id: 2,
    icon: 'bi bi-truck',
    title: '免費宅配',
    description: '單筆消費滿2,000元享免費宅配'
  },
  {
    id: 3,
    icon: 'bi bi-arrow-clockwise',
    title: '七天鑑賞期',
    description: '商品享七天鑑賞期保障'
  },
  {
    id: 4,
    icon: 'bi bi-credit-card',
    title: '分期零利率',
    description: '單筆滿3,000元享信用卡分期零利率'
  }
]
</script>

<style lang="scss" scoped>
$primary: #7030a0;
$secondary: #a855f7;

.service-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 4rem 2rem;
  margin-top: 3rem;
  position: relative;
  overflow: hidden;

  // 裝飾性背景圖案
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba($primary, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba($secondary, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 2.5rem 1rem;
    margin: 2rem 0;
  }
}

.service-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, $primary, $secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  i {
    font-size: 1.75rem;
    color: $primary;
    -webkit-text-fill-color: $primary;
    animation: twinkle 2s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;

    i {
      font-size: 1.25rem;
    }
  }
}

@keyframes twinkle {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.section-subtitle {
  font-size: 1.1rem;
  color: #4a5568;
  margin: 0;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
}

.service-cards-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.service-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, $primary, $secondary);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }

  // 卡片背景裝飾
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    right: -20%;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba($primary, 0.03) 0%, transparent 70%);
    border-radius: 50%;
    transition: all 0.4s ease;
  }

  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 16px 40px rgba($primary, 0.25);
    border-color: rgba($primary, 0.2);

    &::before {
      transform: scaleX(1);
    }

    &::after {
      bottom: -30%;
      right: -10%;
      width: 200px;
      height: 200px;
    }

    .service-icon {
      background: linear-gradient(135deg, $primary, $secondary);
      color: white;
      transform: scale(1.15) rotate(5deg);
      box-shadow: 0 8px 20px rgba($primary, 0.3);
    }

    .service-title {
      color: $primary;
    }
  }
}

.service-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba($primary, 0.15), rgba($secondary, 0.15));
  color: $primary;
  margin-bottom: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 12px rgba($primary, 0.1);

  i {
    font-size: 2.25rem;
    transition: transform 0.3s ease;
  }
}

.service-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.service-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.75rem;
  margin-top: 0;
  transition: color 0.3s ease;
}

.service-description {
  font-size: 1rem;
  color: #718096;
  line-height: 1.7;
  margin: 0;
  font-weight: 500;
}

@media (max-width: 768px) {
  .service-card {
    padding: 2rem 1.25rem;
  }

  .service-icon {
    width: 60px;
    height: 60px;

    i {
      font-size: 1.9rem;
    }
  }

  .service-title {
    font-size: 1.15rem;
  }

  .service-description {
    font-size: 0.9rem;
  }
}
</style>