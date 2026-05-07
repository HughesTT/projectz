<template>
  <div class="product-more-page">
    <LoadingOverlay :active="isLoading" color="#7030a0" message="讀取中..." />

    <div class="container" v-if="product">
      <!-- 上方：左右兩欄布局 -->
      <div class="product-main-section">
        <!-- 左側：產品圖片 -->
        <div class="product-image-section">
          <div class="main-image">
            <img :src="product.imageUrl" :alt="product.title" @error="handleImageError">
          </div>
        </div>

        <!-- 右側：產品資訊 -->
        <div class="product-info-section">
          <!-- 產品名稱 -->
          <h1 class="product-title">{{ product.title }}</h1>

          <!-- 產品分類 -->
          <div class="product-category">
            <span class="category-badge">{{ product.category || '未分類' }}</span>
          </div>

          <!-- 產品描述 -->
          <div class="product-description">
            <p class="formatted-text">{{ product.content || '暫無描述' }}</p>
          </div>

          <!-- 價格 -->
          <div class="product-price">
            <span class="currency">NT$</span>
            <span class="price-amount">{{ product.price?.toLocaleString() || '0' }}</span>
          </div>

          <!-- 數量調整工具 -->
          <div class="quantity-section">
            <label class="quantity-label">數量</label>
            <div class="quantity-controls">
              <button class="qty-btn" @click="decreaseQuantity" :disabled="quantity <= 1">
                <i class="bi bi-dash"></i>
              </button>
              <input type="number" class="qty-input" v-model.number="quantity" min="1" max="99">
              <button class="qty-btn" @click="increaseQuantity" :disabled="quantity >= 99">
                <i class="bi bi-plus"></i>
              </button>
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div class="action-buttons">
            <button class="btn-add-cart" @click="addToCart">
              <i class="bi bi-cart-plus"></i>
              <span>加入購物車</span>
            </button>
            <button class="btn-favorite" :class="{ active: isFavorite }" @click="handleToggleFavorite">
              <i class="bi" :class="isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
              <span>{{ isFavorite ? '已追蹤' : '加入追蹤' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 下方：完整說明與其他產品圖片 -->
      <div class="product-detail-section">
        <!-- Tab 切換說明 -->
        <div class="detail-description">
          <h2 class="section-title">
            <i class="bi bi-file-text"></i>
            產品詳細說明
          </h2>

          <!-- Tab 頁籤 -->
          <div class="tab-navigation">
            <button class="tab-btn" :class="{ active: activeTab === 'intro' }" @click="activeTab = 'intro'">
              <i class="bi bi-info-circle"></i>
              產品介紹
            </button>
            <button class="tab-btn" :class="{ active: activeTab === 'spec' }" @click="activeTab = 'spec'">
              <i class="bi bi-clipboard-data"></i>
              產品規格
            </button>
          </div>

          <!-- Tab 內容 -->
          <div class="tab-content">
            <!-- 介紹頁籤 -->
            <div v-if="activeTab === 'intro'" class="tab-pane intro-pane">
              <!-- 第一列：左邊圖片1，右邊說明文字 -->
              <div class="intro-row">
                <div class="intro-col intro-col-left">
                  <div v-if="product.images && product.images[0]" class="image-wrapper">
                    <img :src="product.images[0]" alt="產品圖片1" class="product-detail-img" @error="handleImageError" />
                  </div>
                </div>
                <div class="intro-col intro-col-right">
                  <div class="intro-text">
                    <p>{{ product.description || '暫無詳細說明' }}</p>
                  </div>
                </div>
              </div>

              <!-- 第二列：左邊預設圖片，右邊圖片2 -->
              <div class="intro-row">
                <div class="intro-col intro-col-left">
                  <div class="image-wrapper">
                    <img :src="defaultBlockImg" alt="產品展示" class="product-detail-img" @error="handleImageError" />
                  </div>
                </div>
                <div class="intro-col intro-col-right">
                  <div v-if="product.images && product.images[1]" class="image-wrapper">
                    <img :src="product.images[1]" alt="產品圖片2" class="product-detail-img" @error="handleImageError" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 規格頁籤 -->
            <div v-if="activeTab === 'spec'" class="tab-pane spec-pane">
              <div class="spec-image">
                <img :src="specificationImg" alt="產品規格" class="specification-img" @error="handleImageError" />
              </div>
            </div>
          </div>
        </div>

        <!-- 其他產品圖片/相關產品 -->
        <div class="related-products" v-if="relatedProducts.length > 0">
          <h2 class="section-title">
            <i class="bi bi-grid-3x3-gap"></i>
            你可能感興趣的
          </h2>
          <div class="related-grid">
            <div class="related-item" v-for="item in relatedProducts" :key="item.id" @click="goToProduct(item.id)">
              <div class="related-image">
                <img :src="item.imageUrl" :alt="item.title" @error="handleImageError">
              </div>
              <div class="related-info">
                <h4>{{ item.title }}</h4>
                <p class="related-price">NT$ {{ item.price?.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 空狀態 -->
    <div class="empty-state" v-else-if="!isLoading">
      <i class="bi bi-box-seam"></i>
      <h3>商品不存在</h3>
      <p>您查看的商品不存在或已下架，請至點選其他商品繼續選購。</p>
    </div>
    <ServiceCard />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useStatusStore } from '../../store/statusStore'
import { useProductStore } from '../../store/productStore'
import { useFavorite } from '../../composable/useFavorite';
import { useCart } from '../../composable/useCart'
import { showToast } from '../../composable/useToast'
import ServiceCard from '../../components/ServiceCard.vue'
import LoadingOverlay from '../../components/backstage/LoadingOverlay.vue';

// 使用 import 導入靜態圖片
import defaultBlockImg from '/img/defaultblock.731a071a.jpg'
import specificationImg from '/img/specification.4bd5d369.png'

const route = useRoute()
const router = useRouter()
const statusStore = useStatusStore()
const productStore = useProductStore()
const { isLoading } = storeToRefs(statusStore)
const { favorites, favoriteIds, toggleFavorite, getFavorite } = useFavorite()
const { addToCart: addToCartAction } = useCart()

const product = ref(null)
const productImages = ref([])
const quantity = ref(1)
const activeTab = ref('intro') // intro 或 spec

// 是否已加入追蹤清單
const isFavorite = computed(() => {
  return product.value ? favoriteIds.value.includes(product.value.id) : false
})

// 相關產品（同類別的其他產品）
const relatedProducts = computed(() => {
  if (!product.value) return []

  return productStore.allProducts
    .filter(p =>
      p.id !== product.value.id && // 排除目前產品
      (p.category === product.value.category || p.unit === product.value.unit) // 同類別或同單位
    )
    .slice(0, 4) // 最多顯示 4 個
})

// 載入產品資料
const loadProduct = async () => {
  const productId = route.params.productId

  // 確保產品資料已載入
  if (productStore.allProducts.length === 0) {
    await productStore.getAllProducts()
  }

  // 從 store 中尋找產品
  product.value = productStore.allProducts.find(p => p.id === productId)
  productImages.value = product.value?.images || []

  if (!product.value) {
    // 產品不存在，跳轉到404頁面
    router.replace({ name: '404Page' })
  }
}

// 數量增加
const increaseQuantity = () => {
  if (quantity.value < 99) {
    quantity.value++
  }
}

// 數量減少
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// 加入購物車
const addToCart = () => {
  if (!product.value) return

  addToCartAction(product.value, quantity.value)
  quantity.value = 1 // 重置數量
}

// 切換追蹤清單
const handleToggleFavorite = () => {
  if (!product.value) return
  toggleFavorite(product.value)
}

// 跳轉到其他產品
const goToProduct = (productId) => {
  router.push({ name: 'ProductId', params: { productId } })
  // 導航後由 watch 處理滾動和載入
}

// 圖片錯誤處理
const handleImageError = (event) => {
  event.target.src = '/img/default_img.png'
}

const scrollToTop = () => {
  // 檢測是否為移動裝置
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  // 強制滾動函數
  const forceScroll = () => {
    window.scrollTo(0, 0)
    if (document.documentElement) document.documentElement.scrollTop = 0
    if (document.body) document.body.scrollTop = 0

    // 移動裝置額外處理：嘗試 scrollIntoView
    if (isMobile && document.body) {
      document.body.scrollIntoView({ block: 'start', inline: 'start' })
    }
  }

  // 立即執行第一次
  forceScroll()

  // 使用 requestAnimationFrame 確保在瀏覽器重繪後執行
  requestAnimationFrame(() => {
    forceScroll()

    requestAnimationFrame(() => {
      forceScroll()

      // 移動裝置需要更多次確保和更長延遲（等待地址欄穩定）
      if (isMobile) {
        const intervals = [50, 100, 150, 200, 300]
        intervals.forEach(delay => {
          setTimeout(forceScroll, delay)
        })
      } else {
        // 桌面裝置只需一次延遲備份
        setTimeout(forceScroll, 100)
      }
    })
  })
}

// 監聽路由參數變化
watch(() => route.params.productId, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    // 移動裝置：立即先滾動一次（在資料載入前）
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) {
      window.scrollTo(0, 0)
      if (document.documentElement) document.documentElement.scrollTop = 0
      if (document.body) document.body.scrollTop = 0
    }

    // 載入資料
    await loadProduct()

    // 等待 DOM 更新完成
    await nextTick()
    await nextTick()

    // 資料載入後再次滾動
    scrollToTop()
  }
})

onMounted(async () => {
  // 禁用瀏覽器的自動滾動恢復（這在移動裝置上尤其重要）
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }

  getFavorite()

  // 載入產品資料
  await loadProduct()

  // 等待 DOM 完全更新
  await nextTick()
  await nextTick()

  // 首次載入時確保滾動到頂部
  scrollToTop()
})
</script>

<style lang="scss" scoped>
// CSS Variables
$primary-color: #7030a0;
$secondary-color: #a855f7;
$gradient-primary: linear-gradient(135deg, $primary-color, $secondary-color);

.product-more-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f7fafc 0%, #fff 100%);
  padding: 2rem 0 0 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

// 上方：左右兩欄布局
.product-main-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem;
  }
}

// 左側：產品圖片
.product-image-section {
  .main-image {
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }
  }
}

// 右側：產品資訊
.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.product-category {
  .category-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #f7fafc;
    color: $primary-color;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
  }
}

.product-description {
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  line-height: 1.8;
  color: #4a5568;

  p {
    margin: 0;
  }

  .formatted-text {
    white-space: pre-line; // 保留換行符，自動換行
  }
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 1.5rem 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;

  .currency {
    font-size: 1.25rem;
    color: #718096;
    font-weight: 500;
  }

  .price-amount {
    font-size: 2.5rem;
    font-weight: 700;
    background: $gradient-primary;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

// 數量調整
.quantity-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-label {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.qty-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  color: $primary-color;
  font-size: 1.2rem;

  &:hover:not(:disabled) {
    background: #f7fafc;
  }

  &:disabled {
    color: #cbd5e0;
    cursor: not-allowed;
  }
}

.qty-input {
  width: 60px;
  height: 40px;
  text-align: center;
  border: none;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  font-size: 1rem;
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

// 操作按鈕
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: auto;

  @media (max-width: 576px) {
    flex-direction: column;
  }
}

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

.btn-favorite {
  background: white;
  color: #e53e3e;
  border: 2px solid #e53e3e;

  &:hover {
    background: #fff5f5;
  }

  &.active {
    background: #e53e3e;
    color: white;
  }
}

// 下方：完整說明與相關產品
.product-detail-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  opacity: 1 !important;
  visibility: visible !important;
}

.detail-description,
.related-products {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  opacity: 1 !important;
  visibility: visible !important;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748 !important;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
  opacity: 1 !important;
  visibility: visible !important;

  i {
    color: $primary-color;
  }
}

// Tab 導覽列
.tab-navigation {
  display: flex !important;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 3px solid #e2e8f0;
  padding-bottom: 0;
  background: #f7fafc;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  opacity: 1 !important;
  visibility: visible !important;
}

.tab-btn {
  flex: 1;
  padding: 1.2rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 4px solid transparent;
  color: #718096;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex !important;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  position: relative;
  margin-bottom: -3px;
  opacity: 1 !important;
  visibility: visible !important;

  i {
    font-size: 1.3rem;
  }

  &:hover {
    color: $primary-color;
    background: rgba($primary-color, 0.1);
  }

  &.active {
    color: white !important;
    background: linear-gradient(135deg, $primary-color, $secondary-color);
    border-bottom-color: transparent;
    box-shadow: 0 4px 12px rgba($primary-color, 0.3);

    i {
      transform: scale(1.15);
    }
  }
}

// Tab 內容區域
.tab-content {
  padding: 2rem;
  background: white;
  border-radius: 0 0 12px 12px;
  min-height: 500px;
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
}

.tab-pane {
  min-height: 400px;
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
}

// 介紹頁籤樣式
.intro-pane {
  opacity: 1 !important;
  visibility: visible !important;

  // 每一列的容器
  .intro-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2.5rem;
    align-items: center;
    opacity: 1 !important;
    visibility: visible !important;

    &:last-child {
      margin-bottom: 0;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  // 左右兩欄
  .intro-col {
    opacity: 1 !important;
    visibility: visible !important;
  }

  .intro-col-left {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .intro-col-right {
    display: flex;
    align-items: center;
    padding: 1rem;
  }

  .intro-text {
    line-height: 1.8;
    color: #4a5568 !important;
    font-size: 1rem;
    opacity: 1 !important;
    visibility: visible !important;

    p {
      margin: 0;
      white-space: pre-line;
      color: #4a5568 !important;
      opacity: 1 !important;
    }
  }

  .image-wrapper {
    width: 100%;
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important;
  }

  .product-detail-img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    transition: transform 0.3s ease;
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;

  }
}

// 規格頁籤樣式
.spec-pane {
  opacity: 1 !important;
  visibility: visible !important;

  .spec-image {
    display: flex !important;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    opacity: 1 !important;
    visibility: visible !important;
  }

  .specification-img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
}

.description-content {
  line-height: 1.8;
  color: #4a5568 !important;
  font-size: 1rem;
  opacity: 1 !important;
  visibility: visible !important;

  p {
    margin: 0;
    color: #4a5568 !important;
  }

  .formatted-text {
    white-space: pre-line; // 保留換行符，自動換行
    color: #4a5568 !important;
  }
}

// 相關產品網格
.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.related-item {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(112, 48, 160, 0.15);
  }
}

.related-image {
  width: 100%;
  padding-top: 100%;
  position: relative;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.related-info {
  padding: 1rem;

  h4 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 0.5rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .related-price {
    font-size: 1.125rem;
    font-weight: 700;
    color: $primary-color;
    margin: 0;
  }
}

// 空狀態
.empty-state {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  i {
    font-size: 4rem;
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
    line-height: 1.6;

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

// Tab 響應式設計
@media (max-width: 768px) {
  .tab-btn {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;

    i {
      font-size: 1rem;
    }
  }

  .tab-pane {
    min-height: 300px;
  }

  .detail-description,
  .related-products {
    padding: 1.5rem;
  }
}

@media (max-width: 576px) {
  .tab-btn {
    padding: 0.7rem 0.8rem;
    font-size: 0.85rem;
    flex-direction: column;
    gap: 0.3rem;

    i {
      font-size: 1.2rem;
    }
  }

  .tab-navigation {
    gap: 0.25rem;
  }
}
</style>