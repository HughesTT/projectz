<template>
  <div class="product-page">
    <LoadingOverlay :active="isLoading" color="#7030a0" message="讀取中..." />

    <!-- 頁面標題 -->
    <div class="page-header">
      <h2 class="bs-purple">
        <i class="bi bi-box-seam me-2"></i>
        {{ pageTitle }}
      </h2>
      <button class="btn btn-purple" @click="handleCreate">
        <i class="bi bi-plus-lg me-2"></i>
        新增產品
      </button>
    </div>

    <!-- 產品列表 -->
    <div class="products-container">
      <!-- 無產品時顯示 -->
      <div v-if="filteredProducts.length === 0 && !isLoading" class="empty-state">
        <i class="bi bi-inbox"></i>
        <p>{{ emptyMessage }}</p>
      </div>

      <!-- 產品表格 -->
      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th style="width: 100px">圖片</th>
              <th>產品名稱</th>
              <th style="width: 120px">分類</th>
              <th style="width: 120px" class="text-end">原價</th>
              <th style="width: 120px" class="text-end">售價</th>
              <th style="width: 100px" class="text-center">狀態</th>
              <th style="width: 150px" class="text-center">編輯</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product.id">
              <!-- 圖片 -->
              <td>
                <img :src="product.imageUrl" :alt="product.title" class="product-thumbnail" @error="handleImageError">
              </td>

              <!-- 產品名稱 -->
              <td>
                <div class="product-title">{{ product.title }}</div>
                <small class="text-muted" v-if="product.description">
                  {{ truncateText(product.description, 50) }}
                </small>
              </td>

              <!-- 分類 -->
              <td>
                <span class="badge bg-secondary">{{ product.category }}</span>
              </td>

              <!-- 原價 -->
              <td class="text-end">
                <span class="text-muted text-decoration-line-through">
                  NT$ {{ formatPrice(product.origin_price) }}
                </span>
              </td>

              <!-- 售價 -->
              <td class="text-end">
                <span class="fw-bold text-primary">
                  NT$ {{ formatPrice(product.price) }}
                </span>
              </td>

              <!-- 狀態 -->
              <td class="text-center">
                <span class="badge" :class="product.is_enabled ? 'bg-success' : 'bg-danger'">
                  {{ product.is_enabled ? '啟用' : '停用' }}
                </span>
              </td>

              <!-- 操作按鈕 -->
              <td class="text-center">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-primary" title="編輯" @click="handleEdit(product)">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-outline-danger" title="刪除" @click="handleDelete(product)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 產品統計資訊 -->
    <div v-if="filteredProducts.length > 0" class="products-stats">
      <span class="text-muted mt-2 ms-2 d-block">
        共 <strong>{{ totalCount }}</strong> 筆產品
      </span>
      <PaginationEl :pages="paginationInfo" @emit-pages="handlePageChange" />
    </div>
  </div>
  <ProductModal ref="productModalRef" :product="selectedProduct" :isNew="isNewProduct"
    @update-product="handleUpdateProduct" />
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useStatusStore } from '../../store/statusStore'
import { useProductStore } from '../../store/productStore'
import { showToast } from '../../composable/useToast'
import LoadingOverlay from '../../components/backstage/LoadingOverlay.vue'
import ProductModal from '../../components/backstage/ProductModal.vue'
import PaginationEl from '../../components/PaginationEl.vue'


// 使用 Pinia 狀態管理
const route = useRoute()
const productStore = useProductStore()
const statusStore = useStatusStore()

// 使用 storeToRefs 取得響應式資料
const { allProducts } = storeToRefs(productStore)
const { isLoading } = storeToRefs(statusStore)

// Modal 相關狀態
const productModalRef = ref(null)
const selectedProduct = ref({})
const isNewProduct = ref(true)

// 當前頁碼
const currentPage = ref(1)

// 類別對照表
const categoryMap = {
  'headphone': '耳機',
  'speaker': '喇叭',
  'tv': '電視'
}

// 取得當前類別參數（從路由）
const currentCategory = computed(() => route.params.category || null)

// 頁面標題
const pageTitle = computed(() => {
  if (currentCategory.value) {
    return `${categoryMap[currentCategory.value] || currentCategory.value}管理`
  }
  return '產品管理'
})

// 空狀態訊息
const emptyMessage = computed(() => {
  if (currentCategory.value) {
    return `尚未有${categoryMap[currentCategory.value] || currentCategory.value}類別的產品`
  }
  return '尚未有產品資料'
})

// 篩選產品（根據 unit 欄位）
const filteredProducts = computed(() => {
  if (!currentCategory.value) {
    return allProducts.value
  }
  return allProducts.value.filter(product =>
    product.unit && product.unit.toLowerCase() === currentCategory.value.toLowerCase()
  )
})

// 分頁後的產品列表
const paginatedProducts = computed(() => {
  const itemsPerPage = 10
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// 總筆數
const totalCount = computed(() => filteredProducts.value.length)

// 分頁資訊（客戶端分頁）
const paginationInfo = computed(() => {
  const itemsPerPage = 10
  const total = filteredProducts.value.length
  const totalPages = Math.ceil(total / itemsPerPage)

  return {
    total_pages: totalPages,
    current_page: currentPage.value,
    has_pre: currentPage.value > 1,
    has_next: currentPage.value < totalPages,
    category: currentCategory.value
  }
})

// 頁面載入時取得產品資料
onMounted(async () => {
  await productStore.getAllProducts()
  currentPage.value = 1
})

// 監聽路由變化
watch(() => route.params.category, async () => {
  currentPage.value = 1
  // 不需要重新載入，因為已經有所有產品資料
})

// 處理分頁變化（客戶端分頁）
const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 價格千分位格式化
const formatPrice = (price) => {
  return price.toLocaleString('zh-TW')
}

// 超過字數截斷並加上省略號
const truncateText = (text, maxlength) => {
  if (!text.length) return ''
  return text.length > maxlength ? text.slice(0, maxlength) + '...' : text
}

// 圖片載入錯誤處理
const handleImageError = (e) => {
  e.target.src = '/img/default_img.png'
}

// 新增產品
const handleCreate = () => {
  isNewProduct.value = true
  selectedProduct.value = {} // 清空選擇的產品
  productModalRef.value?.showModal()
}

// 編輯產品
const handleEdit = (product) => {
  isNewProduct.value = false
  selectedProduct.value = { ...product } // 複製產品資料
  productModalRef.value?.showModal()
}

// 刪除產品
const handleDelete = async (product) => {
  if (!confirm(`確定要刪除「${product.title}」嗎？`)) {
    return
  }
  const result = await productStore.deleteProduct(product.id)

  if (result.success) {
    showToast(result.message, 'success')
    // 重新載入所有產品資料
    await productStore.getAllProducts()
  } else {
    showToast(result.message, 'error')
  }
}

// 處理產品更新（新增或編輯）
const handleUpdateProduct = async (product) => {
  let result
  if (isNewProduct.value) {
    // 新增產品
    result = await productStore.createProduct(product)
  } else {
    // 更新產品
    result = await productStore.updateProduct(product)
  }

  if (result.success) {
    showToast(result.message, 'success')
    productModalRef.value?.hideModal()
    // 重新載入所有產品資料
    await productStore.getAllProducts()
  } else {
    showToast(result.message, 'error')
  }
}

// 畫面載入自動捲動到頂部
watch(isLoading, (newValue) => {
  if (!newValue) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})



</script>

<style lang="scss" scoped>
.product-page {
  padding: 0 2rem;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e2e8f0;
  }

  .page-header h2 {
    margin: 0;
    color: #2d3748;
    font-weight: 600;
    display: flex;
    align-items: center;
  }

  .products-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    /* 空狀態 */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #a0aec0;
    }

    .empty-state i {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
    }

    .empty-state p {
      font-size: 1.1rem;
      margin: 0;
    }

    /* 表格樣式 */
    .table {
      margin-bottom: 0;
    }

    .table thead {
      background: #f7fafc;
    }

    .table thead th {
      border-bottom: 2px solid #e2e8f0;
      color: #4a5568;
      font-weight: 600;
      padding: 1rem 0.75rem;
    }

    .table tbody td {
      vertical-align: middle;
      padding: 1rem 0.75rem;
    }

    .table tbody tr {
      transition: background-color 0.2s;
    }

    .table tbody tr:hover {
      background-color: #f7fafc;
    }

    /* 產品縮圖 */
    .product-thumbnail {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .product-title {
      font-weight: 500;
      color: #2d3748;
      margin-bottom: 0.25rem;
    }

    /* 產品統計 */
    .products-stats {
      padding: 1rem 1.5rem;
      background: #f7fafc;
      border-top: 1px solid #e2e8f0;
    }

    /* 按鈕群組 */
    .btn-group-sm>.btn {
      padding: 0.375rem 0.75rem;
    }
  }
}
</style>