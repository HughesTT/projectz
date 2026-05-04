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
import {
  getCategoryInfoFromProduct,
  getMemberPageInfo,
  isProductListPage,
  isMemberPage,
  productCategories
} from '../config/routeConfig';

const route = useRoute();
const productStore = useProductStore();
const breadcrumbs = ref([]);

// 生成麵包屑邏輯
const generateBreadcrumbs = () => {
  const crumbs = [];
  const pathArray = route.path.split('/').filter(p => p);

  // 優先檢查路由的 meta.breadcrumb 配置
  if (route.meta?.breadcrumb) {
    // 如果路由有自定義麵包屑配置，直接使用
    crumbs.push(...route.meta.breadcrumb);
  }
  // 判斷是否為產品詳情頁
  else if (route.name === 'ProductId' && route.params.productId) {
    // 從 productStore 獲取產品資料
    const product = productStore.allProducts.find(p => p.id === route.params.productId);

    if (product) {
      // 使用配置文件的函數獲取分類信息
      const categoryInfo = getCategoryInfoFromProduct(product);

      if (categoryInfo) {
        // 添加分類層級
        crumbs.push({
          name: categoryInfo.name,
          path: categoryInfo.path
        });

        // 添加產品名稱（最後一層，不可點擊）
        crumbs.push({
          name: product.title || '產品詳情',
          path: null
        });
      }
    }
  }
  // 判斷是否為產品列表頁（耳機/揚聲器/電視）
  else if (pathArray.includes('products') && route.name && isProductListPage(route.name)) {
    crumbs.push({
      name: route.name,
      path: null  // 目前頁面不可點擊
    });
  }
  // 判斷是否為會員中心頁面
  else if (pathArray.includes('member') && isMemberPage(route.name)) {
    const memberPageInfo = getMemberPageInfo(route.name);

    // 添加會員中心層級
    crumbs.push({
      name: '會員中心',
      path: '/member'
    });

    // 添加子頁面
    if (memberPageInfo) {
      crumbs.push({
        name: memberPageInfo.name,
        path: null  // 目前頁面不可點擊
      });
    }
  }
  // 其他頁面
  else if (route.name) {
    crumbs.push({
      name: route.name,
      path: null
    });
  }

  breadcrumbs.value = crumbs;
};

// 監聽路由變化
watch(
  () => [route.path, route.params.productId],
  async () => {
    // 如果是產品詳情頁且還沒載入產品資料
    if (route.name === 'ProductId' && productStore.allProducts.length === 0) {
      await productStore.getAllProducts();
    }
    generateBreadcrumbs();
  },
  { immediate: true, deep: true }
);

// 監聽產品資料變化（確保資料載入後更新麵包屑）
watch(
  () => productStore.allProducts.length,
  () => {
    if (route.name === 'ProductId') {
      generateBreadcrumbs();
    }
  }
);
</script>

<style lang="scss">
$primary-color: #7030a0;
$secondary-color: #a855f7;

.breadcrumb-container {
  width: 1400px;
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
    margin-bottom: 1rem;
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