import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function showToast(message, type = 'success', duration = 3000) {
  const id = toastId++
  toasts.value.push({ id, message, type })

  setTimeout(() => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }, duration)
}

export function useToast() {
  return {
    toasts,
    showToast
  }
}