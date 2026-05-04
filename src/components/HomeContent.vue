<template>
  <div class="home-content">
    <!-- 藍芽區塊 -->
    <section class="bluetooth-section">
      <div class="bluetooth-container">
        <div class="bluetooth-content">
          <div class="content-box">
            <h2 class="title-gradient">無線自由 真實聲音</h2>
            <h3 class="subtitle-accent">親耳感受</h3>
            <p class="description">無論身處健身房、辦公室或任何場所，都能全心投入、保持專注。</p>
            <button class="category-btn" @click.prevent="toCategory('bluetooth')">
              <span>藍芽</span>
              <div class="btn-shine"></div>
            </button>
          </div>
        </div>
        <div class="bluetooth-image">
          <div class="image-gradient-overlay"></div>
          <img src="../../public/img/homesection.47b336b0.png" alt="無線耳機">
        </div>
      </div>
    </section>

    <!-- 降噪區塊 -->
    <section class="noise-section">
      <div class="section-bg" style="background-image: url('../../public/img/noisecanceling_bg.253f34d3.jpg')">
        <div class="content-overlay">
          <div class="content-box">
            <h2 class="title-gradient">全面提升聆聽體驗</h2>
            <p class="description">優異的設計和奢華的材質，提供無與倫比的舒適。讓您的音樂感受達到更高的新境界。</p>
            <p class="description">世界一流的消噪效能，比以往更安靜。突破性空間感音場，讓人聆聽時更沉醉其中。</p>
            <button class="category-btn" @click.prevent="toCategory('noise-canceling')">
              <span>降噪</span>
              <div class="btn-shine"></div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 電競區塊 -->
    <section class="gaming-section">
      <div class="section-bg" style="background-image: url('../../public/img/gaming.719061ea.jpg')">
        <div class="content-overlay content-overlay-right">
          <div class="content-box">
            <h2 class="title-gradient">超長續航 遊戲不斷</h2>
            <p class="description">如果電競是你的天命，那就戴上與頂尖電競專業玩家聯合設計的終極無線耳麥，正面迎戰激烈的遊戲戰場。</p>
            <p class="description">專為滿足極致需求而生，帶給你清晰音訊、進階的噪音隔離效果，以及適合全日使用的舒適。</p>
            <button class="category-btn" @click.prevent="toCategory('gaming')">
              <span>電競</span>
              <div class="btn-shine"></div>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const toCategory = (category) => {
  router.push('/products/headphone')
}
</script>

<style lang="scss" scoped>
// 設計系統變數
$primary: #7030a0;
$secondary: #a855f7;
$dark: #1a202c;
$light: #f7fafc;
$white: #ffffff;
$text-primary: #fff;
$text-secondary: #4a5568;
$text-light: #718096;

// 動畫時長
$transition-fast: 0.2s;
$transition-base: 0.3s;
$transition-slow: 0.6s;

// 共用樣式
.home-content {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}

// 區塊共用樣式
section {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
  position: relative;

  @media (max-width: 1440px) {
    max-width: 95%;
  }

  @media (max-width: 768px) {
    padding: 1.5rem 0.75rem;
  }
}

// 藍芽區塊特殊樣式
.bluetooth-section {
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }

  .bluetooth-container {
    display: flex;
    align-items: stretch;
    max-width: 100%;
    margin: 0 auto;
    min-height: 600px;
    background: linear-gradient(135deg, rgba($primary, 0.02), rgba($light, 0.5));
    border-radius: 32px;
    overflow: hidden;
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.08),
      0 8px 24px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);

    @media (max-width: 1024px) {
      flex-direction: column;
      min-height: auto;
      border-radius: 24px;
    }

    @media (max-width: 768px) {
      border-radius: 20px;
    }
  }

  .bluetooth-content {
    flex: 0 0 40%;
    display: flex;
    align-items: center;
    padding: 4rem 3rem;
    position: relative;
    z-index: 2;

    @media (max-width: 1200px) {
      padding: 3rem 2.5rem;
    }

    @media (max-width: 1024px) {
      flex: 1;
      padding: 3rem 2rem;
    }

    @media (max-width: 768px) {
      padding: 2.5rem 1.5rem;
    }

    @media (max-width: 576px) {
      padding: 2rem 1.25rem;
    }

    .content-box {
      max-width: 100%;
      padding: 0;
      background: transparent;
      box-shadow: none;
      backdrop-filter: none;

      &:hover {
        background: transparent;
        box-shadow: none;
        backdrop-filter: none;
        transform: none;
      }

      .title-gradient,
      .subtitle-accent {
        color: $primary;
      }

      .description {
        color: $text-secondary;
      }
    }
  }

  .bluetooth-image {
    flex: 0 0 60%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    overflow: hidden;

    @media (max-width: 1200px) {
      padding: 2.5rem;
    }

    @media (max-width: 1024px) {
      flex: 1;
      min-height: 400px;
      padding: 2rem;
    }

    @media (max-width: 768px) {
      min-height: 320px;
      padding: 1.5rem;
    }

    @media (max-width: 576px) {
      min-height: 280px;
      padding: 1rem;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 24px;
      transition: transform $transition-slow ease;
      box-shadow:
        0 24px 60px rgba(0, 0, 0, 0.15),
        0 8px 20px rgba(0, 0, 0, 0.1);

      @media (max-width: 768px) {
        border-radius: 16px;
      }
    }

    .image-gradient-overlay {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 40%;
      background: linear-gradient(to right,
          rgba($white, 0.95) 0%,
          rgba($white, 0.6) 30%,
          rgba($white, 0.2) 60%,
          transparent 100%);
      z-index: 1;
      pointer-events: none;

      @media (max-width: 1024px) {
        width: 100%;
        height: 30%;
        top: 0;
        left: 0;
        right: 0;
        bottom: auto;
        background: linear-gradient(to bottom,
            rgba($white, 0.9) 0%,
            rgba($white, 0.4) 50%,
            transparent 100%);
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 10%;
      right: 10%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle,
          rgba($secondary, 0.15),
          transparent 70%);
      border-radius: 50%;
      filter: blur(60px);
      animation: float 8s ease-in-out infinite;

      @media (max-width: 768px) {
        width: 200px;
        height: 200px;
      }
    }
  }

  &:hover {
    .bluetooth-image img {
      transform: scale(1.03) rotate(1deg);
    }
  }
}

.section-bg {
  position: relative;
  min-height: 600px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 32px;
  overflow: hidden;

  @media (max-width: 1024px) {
    min-height: 500px;
    border-radius: 24px;
  }

  @media (max-width: 768px) {
    min-height: 450px;
    border-radius: 20px;
  }

  @media (max-width: 576px) {
    min-height: 400px;
    border-radius: 16px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
  }
}

.content-overlay {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  min-height: 600px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 4rem;

  @media (max-width: 1200px) {
    padding: 0 3rem;
  }

  @media (max-width: 1024px) {
    min-height: 500px;
    padding: 0 2.5rem;
  }

  @media (max-width: 768px) {
    min-height: 450px;
    padding: 0 1.5rem;
  }

  @media (max-width: 576px) {
    min-height: 400px;
    padding: 0 1.25rem;
  }
}

// 右側內容覆蓋層樣式
.content-overlay-right {
  justify-content: flex-start;

  .content-box {
    text-align: right;

    @media (max-width: 768px) {
      text-align: left;
    }

    .subtitle-accent::after {
      left: auto;
      right: 0;

      @media (max-width: 768px) {
        left: 0;
        right: auto;
      }
    }
  }
}

.content-box {
  max-width: 550px;
  padding: 3rem;
  backdrop-filter: blur(4px);
  border-radius: 32px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.06);
  transition: all $transition-slow ease;

  @media (max-width: 1200px) {
    max-width: 500px;
    padding: 2.5rem;
  }

  @media (max-width: 1024px) {
    max-width: 480px;
    padding: 2.5rem;
    backdrop-filter: blur(3px);
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 2rem;
    border-radius: 24px;
  }

  @media (max-width: 576px) {
    padding: 1.75rem;
    border-radius: 20px;
  }

  &:hover {
    backdrop-filter: blur(8px);
    box-shadow:
      0 28px 80px rgba(0, 0, 0, 0.12),
      0 12px 32px rgba(0, 0, 0, 0.08);
    transform: translateY(-8px);

    @media (max-width: 768px) {
      transform: translateY(-4px);
    }
  }
}

// 標題樣式
.title-gradient {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, $primary 0%, $secondary 50%, $primary 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 8s ease infinite;
  letter-spacing: -0.02em;
}

.subtitle-accent {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700;
  color: $primary;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  padding-bottom: 0.75rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: $secondary;
    border-radius: 2px;
  }
}

.description {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: $text-primary;
  line-height: 1.8;
  margin-bottom: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

// 按鈕樣式
.category-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.125rem 3rem;
  margin-top: 2rem;
  background: linear-gradient(135deg, $primary, $secondary);
  color: $white;
  font-size: 1.125rem;
  font-weight: 700;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  box-shadow:
    0 8px 20px rgba($primary, 0.3),
    0 4px 8px rgba($primary, 0.2);
  transition: all $transition-base cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.05em;

  @media (max-width: 1024px) {
    padding: 1rem 2.5rem;
    font-size: 1.0625rem;
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
    margin-top: 1.5rem;
  }

  @media (max-width: 576px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.9375rem;
    width: 100%;
    max-width: 280px;
  }

  span {
    position: relative;
    z-index: 2;
  }

  .btn-shine {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 70%);
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
    transition: transform 0.6s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 12px 28px rgba($primary, 0.4),
      0 8px 16px rgba($primary, 0.25);

    .btn-shine {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
  }

  &:active {
    transform: translateY(-1px);
  }
}

// 降噪區塊特殊樣式（內容置中）
.noise-section {
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }

  .content-overlay {
    justify-content: left;
    text-align: left;
  }

  .content-box {
    max-width: 700px;

    @media (max-width: 1024px) {
      max-width: 600px;
    }

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }

  .subtitle-accent::after {
    left: 50%;
    transform: translateX(-50%);

    @media (max-width: 768px) {
      left: 0;
      transform: none;
    }
  }
}

.gaming-section {
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }

  @media (max-width: 576px) {
    margin-bottom: 1.5rem;
  }
}

// 動畫
@keyframes gradient-shift {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0) translateX(0);
  }

  33% {
    transform: translateY(-20px) translateX(10px);
  }

  66% {
    transform: translateY(10px) translateX(-10px);
  }
}

// 額外的小螢幕優化
@media (max-width: 576px) {
  .title-gradient {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  .subtitle-accent {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }

  .description {
    font-size: 0.9375rem;
    line-height: 1.7;
    margin-bottom: 1rem;
  }
}
</style>