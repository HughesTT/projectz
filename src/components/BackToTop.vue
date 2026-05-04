<template>
  <Transition name="fade">
    <div v-if="isVisible" class="back-to-top" @click="scrollToTop">
      <i class="bi bi-arrow-up"></i>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false) // 按鈕顯示狀態，預設隱藏

// 監聽畫面捲動，當捲動至設定位置時顯示按鈕
const handleScroll = () => {
  const scrollPosition = window.scrollY || document.documentElement.scrollTop
  isVisible.value = scrollPosition > 600
}

// 捲動到頂部函式
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// 
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss">
.back-to-top {
  position: fixed;
  z-index: 999;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  background-color: #a855f7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #7030a0;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  i {
    font-size: 1.2rem;
  }
}

// Vue Transition 動畫效果
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>