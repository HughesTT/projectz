<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-heart"></i>
        追蹤清單
      </h1>
      <p class="page-subtitle">管理您的追蹤清單</p>
    </div>

    <div class="profile-content">
      <div class="info-card">
        <div class="info-grid">
          <LoadingOverlay :active="isLoading" loader="spinner" color="#7030a0" message="讀取中..." />
          <div v-if="favorites.length === 0" class="empty-state">
            <i class="bi bi-inbox"></i>
            <p>目前沒有追蹤的產品</p>
          </div>
          <div v-else class="favorites-grid">
            <div v-for="favorite in favorites" :key="favorite.id" class="favorite-card">
              <img :src="favorite.imageUrl" :alt="favorite.title" class="img-fluid favorite-image"
                @click="openProductInNewTab(favorite.id)" @error="handleImageError">
              <h5 class="favorite-title" @click="openProductInNewTab(favorite.id)">{{ favorite.title }}</h5>
              <p class="favorite-category">{{ favorite.category }}</p>
              <div class="favorite-footer">
                <div class="favorite-price">
                  <span class="price-label">NT$</span>
                  <span class="price-value">{{ favorite.price.toLocaleString() }}</span>
                </div>
                <button class="btn-add-cart" @click="addToCart(favorite)">
                  <i class="bi bi-cart-plus"></i>
                  <span>加入購物車</span>
                </button>
                <button class="remove-favorite-btn" @click="toggleFavorite(favorite)">
                  <i class="bi bi-trash"></i>
                  <span>移除</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useStatusStore } from '../../store/statusStore.js'
import { useFavorite } from '../../composable/useFavorite';
import { useCart } from '../../composable/useCart.js'
import { useRouter } from 'vue-router'
import LoadingOverlay from '../../components/backstage/LoadingOverlay.vue';
import { ref, onMounted } from 'vue';

const router = useRouter()
const statusStore = useStatusStore()
const { isLoading } = storeToRefs(statusStore)
const quantity = ref(1)

// 使用 useFavorite composable
const { favorites, toggleFavorite, getFavorite } = useFavorite()

const { addToCart: addToCartAction } = useCart()

// 圖片讀取錯誤處理
const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
}

const addToCart = (favorite) => {
  if (!favorite) return

  addToCartAction(favorite, quantity.value)
  quantity.value = 1 // 重置數量
}

// 在新分頁開啟產品頁面
const openProductInNewTab = (productId) => {
  const route = router.resolve({ name: 'ProductId', params: { productId } })
  window.open(route.href, '_blank')
}

// 載入追蹤清單
getFavorite()
</script>

<style lang="scss" scoped>
$primary-color: #7030a0;
$gradient-primary: linear-gradient(135deg, #7030a0 0%, #a64ca6 100%);

.profile-page {
  width: 100%;
}

.page-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;

  i {
    color: $primary-color;
  }
}

.page-subtitle {
  color: #718096;
  font-size: 0.95rem;
  margin-left: 2.5rem;
}

.profile-content {
  min-height: 400px;
}

.info-card {
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.info-grid {
  position: relative;
  min-height: 200px;
}

/* 空狀態 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;

  i {
    font-size: 5rem;
    color: #cbd5e0;
    margin-bottom: 1rem;
  }

  p {
    color: #718096;
    font-size: 1rem;
    margin: 0;
  }
}

/* 追蹤清單網格 */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

/* 產品卡片 */
.favorite-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e0;
  }
}

.favorite-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #f8f9fa;
  cursor: pointer;

  @media (max-width: 768px) {
    height: 180px;
  }
}

.favorite-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 1rem 1rem 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  min-height: 2.8rem;
  cursor: pointer;
}

.favorite-category {
  font-size: 0.875rem;
  color: #718096;
  margin: 0 1rem 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.favorite-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #e2e8f0;

  .btn-add-cart,
  .btn-favorite {
    flex: 1;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;

    i {
      font-size: 1.2rem;
    }
  }

  .btn-add-cart {
    background: $gradient-primary;
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(112, 48, 160, 0.35);
    }
  }
}

.favorite-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;

  .price-label {
    font-size: 0.875rem;
    color: #718096;
    font-weight: 500;
  }

  .price-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #7030a0;
  }
}

/* 移除按鈕 */
.remove-favorite-btn {
  width: 100%;
  padding: 0.625rem 1rem;
  background: white;
  color: #e53e3e;
  border: 1px solid #e53e3e;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  i {
    font-size: 1rem;
  }

  &:hover {
    background: #e53e3e;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(229, 62, 62, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>