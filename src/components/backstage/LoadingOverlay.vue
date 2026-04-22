<template>
  <Transition name="fade">
    <div v-if="active" class="loading-overlay" :class="{ 'full-page': isFullPage }">
      <div class="loading-container">
        <div class="loading-spinner" :class="loaderClass">
          <div v-for="n in dots" :key="n" class="dot"></div>
        </div>
        <div v-if="message" class="loading-message">{{ message }}</div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  isFullPage: {
    type: Boolean,
    default: true
  },
  loader: {
    type: String,
    default: 'dots',
    validator: (value) => ['dots', 'spinner', 'bars'].includes(value)
  },
  color: {
    type: String,
    default: '#7030a0'
  },
  backgroundColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.8)'
  },
  message: {
    type: String,
    default: ''
  }
})

// 計算 loader 的點數
const dots = computed(() => {
  return props.loader === 'dots' ? 5 : 1
})

const loaderClass = computed(() => `loader-${props.loader}`)
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: v-bind(backgroundColor);
  z-index: 9999;
}

.loading-overlay.full-page {
  position: fixed;
}

.loading-container {
  text-align: center;
}

/* Dots Loader */
.loader-dots {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.loader-dots .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: v-bind(color);
  animation: dot-bounce 1.4s infinite ease-in-out both;
}

.loader-dots .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loader-dots .dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dot-bounce {

  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Spinner Loader */
.loader-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: v-bind(color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Bars Loader */
.loader-bars {
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  height: 40px;
}

.loader-bars .dot {
  width: 6px;
  height: 100%;
  background-color: v-bind(color);
  animation: bar-stretch 1.2s infinite ease-in-out;
}

.loader-bars .dot:nth-child(1) {
  animation-delay: -0.24s;
}

.loader-bars .dot:nth-child(2) {
  animation-delay: -0.12s;
}

@keyframes bar-stretch {

  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }

  20% {
    transform: scaleY(1);
  }
}

.loading-message {
  margin-top: 20px;
  color: v-bind(color);
  font-size: 16px;
  font-weight: 500;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
