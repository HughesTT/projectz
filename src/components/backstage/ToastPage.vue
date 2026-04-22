<template>
  <div class="toast-page-container">
    <ToastMessage v-for="toast in toasts" :key="toast.id" :message="toast.message" :type="toast.type" />
  </div>
</template>

<script setup>
import ToastMessage from './ToastMessage.vue'
import { useToast } from '../../composable/useToast'

const { toasts } = useToast()
</script>

<style scoped>
.toast-page-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>