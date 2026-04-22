<template>
  <div class="toast show" :class="toastClass" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header" :class="headerClass">
      <span class="me-2" style="font-size: 1.2em;">{{ icon }}</span>
      <strong class="me-auto">{{ title }}</strong>
      <small>{{ new Date().toLocaleTimeString() }}</small>
    </div>
    <div class="toast-body">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 定義 props
const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success'
  }
})

const icon = computed(() => {
  const icons = {
    success: '✔️',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[props.type] || '✔️'
})

const title = computed(() => {
  const titles = {
    success: '成功',
    error: '錯誤',
    warning: '警告',
    info: '訊息'
  }
  return titles[props.type] || '通知'
})

const toastClass = computed(() => `toast-${props.type}`)
const headerClass = computed(() => `bg-${props.type === 'error' ? 'danger' : props.type} text-white`)
</script>

<style scoped>
.toast {
  min-width: 300px;
}

.toast-success .toast-header {
  background-color: #4caf50 !important;
}

.toast-error .toast-header {
  background-color: #f44336 !important;
}

.toast-warning .toast-header {
  background-color: #ff9800 !important;
}

.toast-info .toast-header {
  background-color: #2196f3 !important;
}
</style>
