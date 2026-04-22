<template>
  <!-- 自訂 Loading 元件 -->
  <!-- <LoadingOverlay :active="isLoading" :is-full-page="true" loader="dots" color="#7030a0" message="載入中..." /> -->

  <div class="dashboard-layout">
    <!-- 側邊導覽（固定位置） -->
    <Navbar />

    <!-- 主要內容區 -->
    <div class="dashboard-content">
      <router-view />
    </div>
  </div>

  <ToastPage />
</template>

<script setup>
import { onMounted } from 'vue';
import Navbar from '../../components/backstage/Navbar.vue'
import ToastPage from '../../components/backstage/ToastPage.vue'
import { useStatusStore } from '../../store/statusStore'
import { storeToRefs } from 'pinia';

const statusStore = useStatusStore()
const { isLoading } = storeToRefs(statusStore)

onMounted(() => {
  isLoading.value = true

  // 模擬讀取時間（實際使用時可以移除或根據需求調整）
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f7fafc;
}

.dashboard-content {
  flex: 1;
  margin-left: 250px;
  /* 配合 Navbar 的固定寬度 */
  padding: 1rem 2rem;
  min-height: 100vh;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .dashboard-content {
    margin-left: 0;
    padding: 1rem;
  }
}
</style>