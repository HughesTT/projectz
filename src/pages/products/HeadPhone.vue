<template>
  <LoadingOverlay :active="isLoading" color="#7030a0" message="讀取中..." />

  <div class="headphone-page">

    <!-- 主要內容區 -->
    <div class="container">
      <div class="content-layout">
        <!-- 左側分類側欄 -->
        <aside class="category-sidebar">
          <div class="sidebar-header">
            <h3>產品分類</h3>
          </div>
          <div class="category-scroll-wrapper">
            <ul ref="categoryList" class="category-list" @scroll="checkScroll">
              <li :class="{ active: selectedCategory === 'all' }" @click="selectedCategory = 'all'">
                <i class="bi bi-circle-fill"></i>
                全系列耳機
              </li>
              <li :class="{ active: selectedCategory === '藍芽' }" @click="selectedCategory = '藍芽'">
                <i class="bi bi-bluetooth"></i>
                藍芽耳機
              </li>
              <li :class="{ active: selectedCategory === '電競' }" @click="selectedCategory = '電競'">
                <i class="bi bi-controller"></i>
                電競耳機
              </li>
              <li :class="{ active: selectedCategory === '降噪' }" @click="selectedCategory = '降噪'">
                <i class="bi bi-headphones"></i>
                降噪耳機
              </li>
              <li :class="{ active: selectedCategory === '音樂眼鏡' }" @click="selectedCategory = '音樂眼鏡'">
                <i class="bi bi-sunglasses"></i>
                音樂眼鏡
              </li>
            </ul>
            <div class="scroll-indicator" v-show="showScrollIndicator">
              <i class="bi bi-chevron-right"></i>
            </div>
          </div>
        </aside>

        <!-- 右側產品列表 -->
        <main class="products-main">
          <div class="products-section">
            <div class="products-grid">
              <div class="product-card" v-for="product in filteredProducts" :key="product.id">
                <div>
                  <!-- 愛心按鈕 -->
                  <button class="favorite-btn" :class="{ active: favoriteIds.includes(product.id) }"
                    @click.stop="toggleFavorite(product)">
                    <i class="bi" :class="favoriteIds.includes(product.id) ? 'bi-heart-fill' : 'bi-heart'"></i>
                  </button>
                  <a href="#" @click.prevent="goToProduct(product.id)">
                    <!-- 產品圖片 -->
                    <div class="product-image-wrapper">
                      <img :src="product.imageUrl" class="product-image" :alt="product.title" @error="handleImageError">

                    </div>

                    <!-- 產品資訊 -->
                    <div class="product-body">
                      <h5 class="product-title">{{ product.title }}</h5>
                      <p class="product-category">{{ product.category }}</p>
                      <div class="product-footer">
                        <div class="product-price">
                          <span class="price-label">NT$</span>
                          <span class="price-value">{{ product.price.toLocaleString() }}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <!-- 空狀態 -->
            <div class="empty-state" v-if="filteredProducts.length === 0">
              <i class="bi bi-inbox"></i>
              <p>目前沒有產品</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useStatusStore } from '../../store/statusStore';
import { useProductStore } from '../../store/productStore';
import { useFavorite } from '../../composable/useFavorite'
import LoadingOverlay from '../../components/backstage/LoadingOverlay.vue';

const productStore = useProductStore();
const statusStore = useStatusStore();
const route = useRoute();
const { goToProduct } = productStore // 函式直接解構
const { selectedCategory, selectedUnit, filteredProducts } = storeToRefs(productStore) // 響應式數據用 storeToRefs
const { isLoading } = storeToRefs(statusStore);

// 使用 useFavorite composable 管理追蹤清單
const { favorites, favoriteIds, toggleFavorite, getFavorite } = useFavorite()

const currentPage = ref('') // 當前頁面名稱
const categoryList = ref(null) // 分類列表 ref
const showScrollIndicator = ref(false) // 是否顯示滾動指示器

// 圖片載入錯誤處理
const handleImageError = (event) => {
  event.target.src = '/img/default_img.png'
}

// backToTop圖示是否顯示
const checkScroll = () => {
  if (categoryList.value) {
    const element = categoryList.value
    const hasScroll = element.scrollWidth > element.clientWidth
    const isAtEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 5
    showScrollIndicator.value = hasScroll && !isAtEnd
  }
}

onMounted(async () => {
  selectedCategory.value = 'all' // 重置分類為全部
  selectedUnit.value = 'headphone' // 設置當前產品類型為耳機
  await productStore.getAllProducts()
  currentPage.value = '耳機' // 更新目前頁面名稱
  getFavorite()

  // 檢查滾動指示器
  await nextTick()
  checkScroll()
  window.addEventListener('resize', checkScroll)
})

// 清理事件監聽
import { onUnmounted } from 'vue'
onUnmounted(() => {
  window.removeEventListener('resize', checkScroll)
})
</script>

<style lang="scss" scoped>
// CSS Variables
$primary-color: #7030a0;
$secondary-color: #a855f7;
$gradient-primary: linear-gradient(135deg, $primary-color, $secondary-color);
$gradient-bg: linear-gradient(to bottom, #f7fafc 0%, #fff 100%);

$text-dark: #2d3748;
$text-medium: #4a5568;
$text-light: #718096;
$text-lighter: #a0aec0;

$bg-white: white;
$bg-light: #f7fafc;
$bg-gray: #e9ecef;
$border-color: #e2e8f0;

$shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.08);
$shadow-md: 0 4px 20px rgba(112, 48, 160, 0.15);
$shadow-lg: 0 16px 32px rgba(112, 48, 160, 0.2);
$shadow-purple: 0 2px 8px rgba(112, 48, 160, 0.3);

$radius-sm: 12px;
$radius-md: 20px;

$transition-fast: 0.3s ease;
$transition-smooth: 0.4s cubic-bezier(0.4, 0, 0.2, 1);

// Mixins
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin card-base {
  background: $bg-white;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
}

// Main Page
.headphone-page {
  min-height: 100vh;
  background: $gradient-bg;
  padding-bottom: 4rem;
}

// Page Header
.page-header {
  padding: 3rem 0;
  margin-bottom: 3rem;
  box-shadow: $shadow-md;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.05)"/></svg>') repeat;
    opacity: 0.3;
  }

  @media (max-width: 768px) {
    padding: 2rem 0;
    margin-bottom: 2rem;
  }
}

.header-content {
  text-align: center;
  color: $primary-color;
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 0.75rem;
  @include flex-center;
  gap: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  i {
    font-size: inherit;
    animation: headphoneBounce 2s ease-in-out infinite;
    will-change: transform;
  }
}

@keyframes headphoneBounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.page-subtitle {
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  opacity: 0.95;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.5px;
}

// Content Layout
.content-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 240px 2fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

// Sidebar
.category-sidebar {
  @include card-base;
  overflow: hidden;
  position: sticky;
  top: 2rem;

  @media (max-width: 768px) {
    position: static;
    top: 0;
    border-radius: $radius-sm;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
}

.sidebar-header {
  background: $gradient-primary;
  color: $bg-white;
  padding: 1.25rem 1.5rem;

  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
  }

  h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.625rem;

    @media (max-width: 768px) {
      font-size: 1rem;
    }

    i {
      font-size: 1rem;

      @media (max-width: 768px) {
        font-size: 0.9rem;
      }
    }
  }
}

.category-scroll-wrapper {
  position: relative;

  @media (max-width: 768px) {
    position: relative;
  }
}

.scroll-indicator {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.95));
    pointer-events: none;
    z-index: 10;

    i {
      font-size: 1.5rem;
      color: $primary-color;
      animation: slideRight 1.5s ease-in-out infinite;
    }
  }
}

@keyframes slideRight {

  0%,
  100% {
    transform: translateX(0);
    opacity: 1;
  }

  50% {
    transform: translateX(5px);
    opacity: 0.5;
  }
}

.category-list {
  list-style: none;
  margin: 0;
  padding: 1rem;

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.75rem;
    gap: 0.5rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  li {
    padding: 0.875rem 1rem;
    margin-bottom: 0.5rem;
    background: $bg-light;
    color: $text-medium;
    border-radius: $radius-sm;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all $transition-fast;
    border: 2px solid transparent;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    @media (max-width: 768px) {
      flex-shrink: 0;
      white-space: nowrap;
      margin-bottom: 0;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      gap: 0.5rem;
      border-radius: 20px;
    }

    i {
      font-size: 0.75rem;
      transition: transform $transition-fast;

      @media (max-width: 768px) {
        font-size: 0.85rem;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    &:hover,
    &.active {
      background: $gradient-primary;
      color: $bg-white;
      box-shadow: 0 4px 12px rgba(112, 48, 160, 0.25);

      i {
        transform: scale(1.2);
      }
    }

    &:hover {
      transform: translateX(5px);

      @media (max-width: 768px) {
        transform: translateY(-2px);
      }
    }

    &.active {
      box-shadow: $shadow-purple;

      i {
        transform: scale(1.1);
      }
    }
  }
}

// Products Section
.products-main {
  min-height: 500px;
}

.products-section {
  margin-top: 0;
}

.products-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.75rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

// Product Card
.product-card {
  @include card-base;
  overflow: hidden;
  transition: all $transition-smooth;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 2px solid transparent;
  will-change: transform;

  &:hover {
    transform: translateY(-10px);
    box-shadow: $shadow-lg;
    border-color: rgba(112, 48, 160, 0.3);
  }

  a {
    color: inherit;
    text-decoration: none;
    display: block;
    flex: 1;
  }
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  // background: linear-gradient(135deg, #f8f9fa, $bg-gray);
  overflow: hidden;
}

.product-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  .product-card:hover & {
    transform: scale(1.08);
  }
}

// Favorite Button
.favorite-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  @include flex-center;
  cursor: pointer;
  transition: all $transition-fast;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 2;

  @media (max-width: 768px) {
    top: 0.75rem;
    right: 0.75rem;
    width: 38px;
    height: 38px;
  }

  @media (max-width: 576px) {
    top: 0.5rem;
    right: 0.5rem;
    width: 36px;
    height: 36px;
  }

  i {
    font-size: 1.3rem;
    color: $text-light;
    transition: color $transition-fast;

    @media (max-width: 768px) {
      font-size: 1.15rem;
    }

    @media (max-width: 576px) {
      font-size: 1.1rem;
    }
  }

  &:hover {
    transform: scale(1.15);
    background: $bg-white;
    box-shadow: 0 4px 16px rgba(229, 62, 62, 0.3);

    i {
      color: #e53e3e;
    }
  }

  &.active {
    background: #fff5f5;
    border: 2px solid #feb2b2;

    i {
      color: #e53e3e;
      animation: heartbeat 0.6s ease-in-out;
    }
  }
}

@keyframes heartbeat {

  0%,
  100% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.3);
  }

  50% {
    transform: scale(1.1);
  }
}

// Product Body
.product-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: $bg-white;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 576px) {
    padding: 1rem;
  }
}

.product-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: $text-dark;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
  min-height: 3rem;
  transition: color $transition-fast;

  @media (max-width: 768px) {
    font-size: 1rem;
    min-height: 2.8rem;
  }

  @media (max-width: 576px) {
    font-size: 0.95rem;
    min-height: 2.6rem;
    margin-bottom: 0.375rem;
  }

  .product-card:hover & {
    color: $primary-color;
  }
}

.product-category {
  font-size: 0.8125rem;
  color: $text-lighter;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background: $bg-light;
  border-radius: $radius-sm;
  display: inline-block;
  align-self: flex-start;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
    margin-bottom: 0.75rem;
    letter-spacing: 0.5px;
  }

  @media (max-width: 576px) {
    font-size: 0.7rem;
    padding: 0.15rem 0.5rem;
    margin-bottom: 0.5rem;
  }
}

.product-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid $border-color;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;

  @media (max-width: 768px) {
    gap: 0.25rem;
  }

  .price-label {
    font-size: 0.9rem;
    color: $text-light;
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 0.85rem;
    }

    @media (max-width: 576px) {
      font-size: 0.8rem;
    }
  }

  .price-value {
    font-size: 1.625rem;
    font-weight: 700;
    background: $gradient-primary;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }

    @media (max-width: 576px) {
      font-size: 1.375rem;
    }
  }
}

// Add to Cart Button
.add-to-cart-btn {
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: $gradient-primary;
  color: $bg-white;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-fast;
  @include flex-center;
  gap: 0.625rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover::before {
    width: 300px;
    height: 300px;
  }

  i,
  span {
    position: relative;
    z-index: 1;
  }

  i {
    font-size: 1.2rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(112, 48, 160, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
}

// Empty State
.empty-state {
  @include card-base;
  text-align: center;
  padding: 5rem 2rem;
  margin: 2rem 0;

  i {
    font-size: 6rem;
    margin-bottom: 1.5rem;
    opacity: 0.4;
    color: #cbd5e0;
  }

  p {
    font-size: 1.25rem;
    margin: 0;
    font-weight: 500;
    color: $text-lighter;
  }
}

// Container
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
}
</style>