<template>
  <div class="homecoupon">
    <div class="homecoupon-box">
      <div class="homecoupon-text">母親節優惠碼</div>
      <div class="homecoupon-code">
        ILOVEMOM
      </div>
      <!-- 使用 v-show 控制顯示與隱藏 -->
      <div class="homecoupon-codecopy" v-show="copycheck">
        <i class="bi bi-check"></i>複製成功
      </div>
      <div class="homecoupon-codecopy" @click="copyCouponcode" v-show="!copycheck">
        <i class="bi bi-copy"></i> 點我複製
      </div>
    </div>
  </div>
  <div class="homecoupon-mobi">
    <div class="homecoupon-box">
      <div class="homecoupon-text">母親節優惠碼</div>
      <div class="homecoupon-code">
        ILOVEMOM
      </div>
      <!-- 使用 v-show 控制顯示與隱藏 -->
      <div class="homecoupon-codecopy" v-show="copycheck">
        <i class="bi bi-check"></i>複製成功
      </div>
      <div class="homecoupon-codecopy" @click="copyCouponcode" v-show="!copycheck">
        <i class="bi bi-copy"></i> 點我複製
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const copycheck = ref(false)

const copyCouponcode = () => {
  const couponcode = 'ILOVEMOM'
  navigator.clipboard.writeText(couponcode)
    .then(() => {
      copycheck.value = true
      setTimeout(() => {
        copycheck.value = false
      }, 2000) // 2秒後自動隱藏提示訊息
    })
    .catch(err => {
      console.error('複製失敗:', err)
    })
}
</script>

<style lang="scss">
$primary-color: #7030a0;
$secondary-color: #a855f7;

// 桌面版優惠券區塊
.homecoupon {
  width: 100%;
  max-width: 1400px;
  margin: 1rem auto;
  padding: 1rem;
  padding-left: 22rem;
  position: relative;
  background-image: url('/img/couponbg.9e205a49.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 20px;

  @media (max-width: 768px) {
    display: none; // 手機版隱藏
  }
}

.homecoupon-box {
  width: 250px;
  padding-top: 17rem;
  min-height: 400px; // 增加最小高度
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  // 添加漸層遮罩增強可讀性
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: 20px;
  }

  // 裝飾圓點
  &::after {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15), transparent);
    border-radius: 50%;
    top: -50px;
    right: -50px;
    z-index: 2;
    animation: pulse 3s ease-in-out infinite;
  }
}

.homecoupon-text {
  position: relative;
  z-index: 3;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.2rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
  animation: fadeInDown 0.8s ease-out;

  &::before {
    content: '🎁';
    margin-right: 1rem;
    animation: bounce 2s ease-in-out infinite;
  }
}

.homecoupon-code {
  position: relative;
  z-index: 3;
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, #fff, #f0e6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 8px;
  padding: 0.1rem 2rem;
  margin-bottom: 0.5rem;
  border: 3px dashed rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.homecoupon-codecopy {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: $primary-color;
  background: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.3s ease-out 0.4s both;

  i {
    font-size: 1.25rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #fff, #f8f4ff);

    i {
      transform: scale(1.2);
    }
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
  }
}

// 行動裝置版優惠券區塊
.homecoupon-mobi {
  display: none;
  width: 100vw; // 使用視口寬度
  margin: 2rem 0;
  padding: 0;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;

  @media (max-width: 960px) {
    display: block;
  }

  .homecoupon-box {
    width: 100%;
    background-image: url('/img/mobi_couponcode.a75e193e.png');
    background-size: cover;
    background-position: left center;
    padding: 13rem 1.5rem 0 1.5rem; // 增加底部內距
    min-height: 400px; // 增加最小高度
    border-radius: 0; // 移除圓角讓它完全佔滿
    justify-content: flex-end; // 讓內容在偏下方
  }

  .homecoupon-text {
    font-size: 1.5rem;
    letter-spacing: 1px;
  }

  .homecoupon-code {
    font-size: 2rem;
    letter-spacing: 4px;
    padding: 0.75rem 1.5rem;
  }

  .homecoupon-codecopy {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

// 動畫定義
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}
</style>