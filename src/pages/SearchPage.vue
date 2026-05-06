<template>
  <LoadingOverlay :active="isLoading" loader="dots" color="#7030a0" message="搜尋中..." />
  <div class="search-page">
    <div class="search-container">
      <h1 class="page-title">
        <i class="bi bi-search"></i>
        商品搜尋
      </h1>

      <!-- 搜尋輸入框 -->
      <div class="search-input-group">
        <input type="text" v-model="searchText" placeholder="請輸入商品名稱..." @keyup.enter="performSearch"
          class="search-input">
        <button type="button" @click="clearSearch" class="clear-btn" v-show="searchText">
          <i class="bi bi-x-lg"></i>
        </button>
        <button type="button" @click="performSearch" class="search-btn">
          <i class="bi bi-search"></i>
          搜尋
        </button>
      </div>

      <!-- 搜尋結果 -->
      <div v-if="hasSearched" class="search-results">
        <div class="results-header">
          <span v-if="filteredResults.length > 0">
            找到 <strong>{{ filteredResults.length }}</strong> 個搜尋結果
          </span>
          <span v-else class="no-results">
            <i class="bi bi-exclamation-circle"></i>
            Oops!找不到「{{ searchQuery }}」的相關商品，請嘗試其他關鍵字。
          </span>
        </div>

        <ul v-if="filteredResults.length > 0" class="product-list">
          <li v-for="product in filteredResults" :key="product.id" class="product-item">
            <div class="product-image">
              <img :src="product.imageUrl" :alt="product.title">
            </div>
            <div class="product-info">
              <h3 class="product-title">{{ product.title }}</h3>
              <p class="product-price">NT$ {{ product.price?.toLocaleString() }}</p>
            </div>
            <button class="view-btn" @click="viewProduct(product.id)">
              商品資訊
            </button>
          </li>
        </ul>
      </div>

      <!-- 未搜尋狀態 -->
      <div v-else class="empty-state">
        <i class="bi bi-search"></i>
        <p>請輸入關鍵字開始搜尋商品</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProductStore } from '../store/productStore'
import { useStatusStore } from '../store/statusStore'
import LoadingOverlay from '../components/backstage/LoadingOverlay.vue'
import { showToast } from '../composable/useToast'

const route = useRoute()
const router = useRouter()
const statusStore = useStatusStore()
const productStore = useProductStore()
const { isLoading } = storeToRefs(statusStore)
const { allProducts } = storeToRefs(productStore)

const searchText = ref('') // 輸入框綁定的值
const filteredResults = ref([]) // 搜尋結果
const hasSearched = ref(false) // 是否已執行過搜尋

// 從 URL 取得搜尋關鍵字（純計算屬性，不修改狀態）
const searchQuery = computed(() => route.query.search || '')

// 執行搜尋（所有邏輯集中在這裡）
const performSearch = async () => {
  const keyword = searchText.value.trim()

  if (!keyword) {
    showToast('請輸入搜尋關鍵字', 'warning')
    return
  }

  isLoading.value = true
  hasSearched.value = true

  try {
    // 更新 URL（不重新載入頁面）
    if (keyword !== searchQuery.value) {
      await router.push({
        path: route.path,
        query: { search: keyword }
      })
    }

    // 執行搜尋
    const results = allProducts.value.filter(product =>
      product.title.toLowerCase().includes(keyword.toLowerCase())
    )

    filteredResults.value = results

    // 提示訊息
    // if (results.length === 0) {
    //   showToast(`找不到「${keyword}」的相關商品`, 'info')
    // } else {
    //   showToast(`找到 ${results.length} 個商品`, 'success')
    // }
  } catch (error) {
    console.error('搜尋失敗:', error)
    showToast('搜尋失敗，請稍後再試', 'error')
  } finally {
    isLoading.value = false
  }
}

const clearSearch = () => {
  searchText.value = ''
}

// 查看商品詳情
const viewProduct = (productId) => {
  router.push(`/products/${productId}`)
}

// 監聽 URL 變化（例如瀏覽器上一頁/下一頁）
watch(searchQuery, (newQuery) => {
  if (newQuery && newQuery !== searchText.value) {
    searchText.value = newQuery
    performSearch()
  }
}, { immediate: true })

onMounted(async () => {
  isLoading.value = true
  try {
    await productStore.getAllProducts()

    // 如果 URL 有搜尋參數，自動執行搜尋
    if (searchQuery.value) {
      searchText.value = searchQuery.value
      await performSearch()
    }
  } catch (error) {
    console.error('載入商品失敗:', error)
    showToast('載入商品失敗', 'error')
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss">
.search-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0 4rem 0;
}

.search-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;

  i {
    color: #7030a0;
  }
}

.search-input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
}

.search-input {
  flex: 1;
  padding: 0.1rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1.3rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #7030a0;
    box-shadow: 0 0 0 4px rgba(112, 48, 160, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }

  @media (max-width: 768px) {
    padding: 1rem 3.5rem 1rem 1.5rem;
  }
}

.clear-btn {
  position: relative;
  right: 60px;
  margin-top: 30px;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  background: #e2e8f0;
  border: none;
  border-radius: 50%;
  color: #4a5568;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0;
  pointer-events: none;

  i {
    font-size: 1rem;
    font-weight: 600;
  }

  &:hover {
    background: #cbd5e0;
    color: #2d3748;
  }

  @media (max-width: 768px) {
    right: 1rem;
    top: 2.75rem;
  }
}

.search-input-group:focus-within .clear-btn {
  opacity: 1;
  pointer-events: auto;
}

.search-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #7030a0, #a855f7);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(112, 48, 160, 0.3);
  }

  i {
    font-size: 1.2rem;
  }
}

.search-results {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.results-header {
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f7fafc;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: #4a5568;

  strong {
    color: #7030a0;
    font-size: 1.3rem;
  }

  .no-results {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #718096;
    font-size: 2rem;

    i {
      color: #f59e0b;
      font-size: 2rem;
    }
  }
}

.product-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.product-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: #edf2f7;
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(112, 48, 160, 0.15);
  }
}

.product-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-info {
  width: 100%;
  text-align: center;
  margin-bottom: 1rem;
}

.product-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em;
}

.product-category {
  font-size: 0.85rem;
  color: #718096;
  margin: 0 0 0.5rem 0;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #7030a0;
  margin: 0;
}

.view-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: white;
  color: #7030a0;
  border: 2px solid #7030a0;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #7030a0;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(112, 48, 160, 0.3);
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  i {
    font-size: 5rem;
    color: #cbd5e0;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.1rem;
    color: #718096;
    margin: 0;
  }
}
</style>