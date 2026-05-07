<template>
  <div class="cart-page">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-cart3"></i>
        購物車
      </h1>
      <p class="page-subtitle">管理您的購物清單</p>
    </div>

    <div class="cart-content">
      <LoadingOverlay :active="isLoading" loader="spinner" color="#7030a0" message="讀取中..." />

      <!-- 空狀態 -->
      <div v-if="cart.length === 0" class="empty-state">
        <i class="bi bi-cart-x"></i>
        <h3>購物車是空的</h3>
        <p>目前購物車中沒有商品，快去<router-link to="/products/headphone">選購商品</router-link>吧！</p>
      </div>

      <!-- 購物車內容 -->
      <div v-else class="cart-container">
        <!-- 購物車列表 -->
        <div class="cart-list">
          <div class="cart-item" v-for="item in cart" :key="item.id">
            <!-- 商品圖片 -->
            <div class="item-image" @click="openProductInNewTab(item.id)">
              <img :src="item.imageUrl" :alt="item.title" @error="handleImageError">
            </div>

            <!-- 商品資訊 -->
            <div class="item-info">
              <h4 class="item-title" @click="openProductInNewTab(item.id)">{{ item.title }}</h4>
            </div>

            <!-- 數量調整 -->
            <div class="item-quantity">
              <label>數量</label>
              <div class="quantity-controls">
                <button class="qty-btn" @click="decreaseQuantity(item)" :disabled="item.quantity <= 1">
                  <i class="bi bi-dash"></i>
                </button>
                <input type="number" class="qty-input" v-model.number="item.quantity"
                  @change="handleQuantityChange(item)" min="1" max="99">
                <button class="qty-btn" @click="increaseQuantity(item)" :disabled="item.quantity >= 99">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>

            <!-- 小計 -->
            <div class="item-subtotal">
              <label>小計</label>
              <p class="subtotal-amount">NT$ {{ (item.price * item.quantity).toLocaleString() }}</p>
            </div>

            <!-- 刪除按鈕 -->
            <div class="item-actions">
              <button class="remove-btn" @click="removeFromCart(item.id)">
                <i class="bi bi-trash"></i>
                <span>刪除</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 購物車摘要 -->
        <div class="cart-summary">
          <div class="summary-card">
            <h3 class="summary-title">
              <i class="bi bi-receipt"></i>
              訂單摘要
            </h3>

            <div class="summary-row">
              <span class="summary-label">商品件數</span>
              <span class="summary-value">{{ cartItemCount }} 件</span>
            </div>

            <div class="summary-row">
              <span class="summary-label">商品總計</span>
              <span class="summary-value">NT$ {{ cartTotal.toLocaleString() }}</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row total-row">
              <span class="summary-label">總金額</span>
              <span class="summary-value total-amount">NT$ {{ cartTotal.toLocaleString() }}</span>
            </div>

            <button class="checkout-btn" @click="goToPayment">
              <i class="bi bi-credit-card"></i>
              <span>前往結帳</span>
            </button>

            <button class="clear-cart-btn" @click="handleClearCart">
              <i class="bi bi-trash"></i>
              <span>清空購物車</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useStatusStore } from '../../store/statusStore.js'
import { useCart } from '../../composable/useCart'
import { showToast } from '../../composable/useToast'
import LoadingOverlay from '../../components/backstage/LoadingOverlay.vue'

const router = useRouter()
const statusStore = useStatusStore()
const { isLoading } = storeToRefs(statusStore)

// 使用 useCart composable
const { cart, cartTotal, cartItemCount, updateQuantity, removeFromCart, clearCart, getCart } = useCart()

// 載入購物車
getCart()

// 增加數量
const increaseQuantity = (item) => {
  if (item.quantity < 20) {
    item.quantity++
    updateQuantity(item.id, item.quantity)
  }
}

// 減少數量
const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--
    updateQuantity(item.id, item.quantity)
  }
}

// 處理數量變更
const handleQuantityChange = (item) => {
  if (item.quantity < 1) {
    item.quantity = 1
  } else if (item.quantity > 99) {
    item.quantity = 99
  }
  updateQuantity(item.id, item.quantity)
}

// 清空購物車
const handleClearCart = () => {
  if (confirm('確定要清空購物車嗎？')) {
    clearCart()
  }
}

// 前往結帳頁面
const goToPayment = () => {
  if (cart.value.length === 0) {
    showToast('購物車是空的', 'warning')
    return
  }
  router.push('/payment')
}

// 在新分頁開啟產品頁面
const openProductInNewTab = (productId) => {
  const route = router.resolve({ name: 'ProductId', params: { productId } })
  window.open(route.href, '_blank')
}

// 圖片載入錯誤處理
const handleImageError = (event) => {
  event.target.src = '/img/default_img.png'
}
</script>

<style lang="scss" scoped>
// CSS Variables
$primary-color: #7030a0;
$secondary-color: #a855f7;
$gradient-primary: linear-gradient(135deg, $primary-color, $secondary-color);

.cart-page {
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
  margin: 0 0 0.5rem 0;

  i {
    color: $primary-color;
  }
}

.page-subtitle {
  color: #718096;
  margin: 0;
  font-size: 0.95rem;
}

.cart-content {
  position: relative;
}

// 空狀態
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  i {
    font-size: 6rem;
    color: #cbd5e0;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    color: #2d3748;
    margin-bottom: 1rem;
  }

  p {
    color: #718096;
    font-size: 1rem;

    a {
      color: $primary-color;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        color: $secondary-color;
      }
    }
  }
}

// 購物車容器
.cart-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

// 購物車列表
.cart-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1.5rem;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(112, 48, 160, 0.15);
  }

  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-column: 2;
  }
}

.item-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: $primary-color;
  }
}

.item-category {
  font-size: 0.875rem;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.item-price {
  font-size: 1rem;
  font-weight: 600;
  color: $primary-color;
  margin: 0;
}

.item-quantity {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-column: 1 / 3;
  }

  label {
    font-size: 0.875rem;
    color: #718096;
    font-weight: 500;
  }
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  color: $primary-color;
  font-size: 1rem;

  &:hover:not(:disabled) {
    background: #f7fafc;
  }

  &:disabled {
    color: #cbd5e0;
    cursor: not-allowed;
  }
}

.qty-input {
  width: 50px;
  height: 32px;
  text-align: center;
  border: none;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;

  &:focus {
    outline: none;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.item-subtotal {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: right;

  @media (max-width: 768px) {
    display: none;
  }

  label {
    font-size: 0.875rem;
    color: #718096;
    font-weight: 500;
  }
}

.subtotal-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.item-actions {
  @media (max-width: 768px) {
    grid-column: 1 / 3;
  }
}

.remove-btn {
  padding: 0.5rem 1rem;
  background: white;
  color: #e53e3e;
  border: 2px solid #e53e3e;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #fff5f5;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}

// 購物車摘要
.cart-summary {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}

.summary-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    color: $primary-color;
  }
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.95rem;

  &.total-row {
    margin-top: 1rem;
    font-size: 1.125rem;
    font-weight: 700;
  }
}

.summary-label {
  color: #718096;
}

.summary-value {
  color: #2d3748;
  font-weight: 600;

  &.total-amount {
    color: $primary-color;
    font-size: 1.5rem;
  }
}

.summary-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 1rem 0;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background: $gradient-primary;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(112, 48, 160, 0.35);
  }
}

.clear-cart-btn {
  width: 100%;
  padding: 0.875rem;
  background: white;
  color: #718096;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.75rem;

  &:hover {
    background: #f7fafc;
    border-color: #e53e3e;
    color: #e53e3e;
  }
}
</style>