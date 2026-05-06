<template>
  <div class="breadcrumb-container">
    <nav class="breadcrumb">
      <router-link to="/" class="breadcrumb-item">
        <i class="bi bi-house-door"></i>
        首頁
      </router-link>

      <template v-if="breadcrumbs.length > 0">
        <i class="bi bi-chevron-right breadcrumb-separator"></i>
        <template v-for="(crumb, index) in breadcrumbs" :key="index">
          <router-link v-if="crumb.path && index < breadcrumbs.length - 1" :to="crumb.path" class="breadcrumb-item">
            {{ crumb.name }}
          </router-link>
          <span v-else class="breadcrumb-item active">
            {{ crumb.name }}
          </span>
          <i v-if="index < breadcrumbs.length - 1" class="bi bi-chevron-right breadcrumb-separator"></i>
        </template>
      </template>
    </nav>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '../store/productStore';

const route = useRoute();
const productStore = useProductStore();
const breadcrumbs = ref([]);

// 麵包屑生成邏輯
const generateBreadcrumbs = async () => {
  const meta = route.meta;

  // 生成 NavBar 既有項目的靜態麵包屑
  if (meta?.breadcrumb) {
    breadcrumbs.value = meta.breadcrumb;
    return;
  }

  // index.js 個別產品的動態麵包屑生成函式
  if (meta?.breadcrumbBuilder) {
    try {
      breadcrumbs.value = await meta.breadcrumbBuilder(route, productStore);
    } catch (error) {
      console.error('麵包屑生成失敗:', error);
      breadcrumbs.value = [];
    }
    return;
  }

  // index.js 沒有特別設定則不顯示麵包屑
  breadcrumbs.value = [];
};

// 監聽路由變化
watch(
  () => [route.path, route.params],
  () => {
    generateBreadcrumbs();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
$primary-color: #7030a0;
$secondary-color: #a855f7;

.breadcrumb-container {
  max-width: 1400px;
  margin: auto;
  background: white;
  border-radius: 12px;
  padding: 0.5rem 1.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  margin-bottom: 0 !important;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;

  i {
    font-size: 1rem;
    transition: transform 0.3s ease;
  }

  &:not(.active) {
    cursor: pointer;

    &:hover {
      color: $primary-color;
      background: linear-gradient(135deg, rgba(112, 48, 160, 0.08), rgba(168, 85, 247, 0.08));
      transform: translateX(2px);

      i {
        transform: scale(1.1);
      }
    }

    &:active {
      transform: translateX(0);
    }
  }

  &.active {
    color: $primary-color;
    font-weight: 600;
    pointer-events: none;
  }
}

.breadcrumb-separator {
  color: #cbd5e0;
  font-size: 0.75rem;
  margin: 0 0.25rem;
}

// 響應式設計
@media (max-width: 768px) {
  .breadcrumb-container {
    padding: 0.875rem 1.25rem;
  }

  .breadcrumb {
    font-size: 0.875rem;
  }

  .breadcrumb-item {
    padding: 0.375rem 0.625rem;

    i {
      font-size: 0.9rem;
    }
  }
}
</style>