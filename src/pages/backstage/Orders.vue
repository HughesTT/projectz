<template>
  <div class="product-page">
    <LoadingOverlay :active="isLoading" loader="spinner" color="#7030a0" message="讀取中..." />

    <!-- 頁面標題 -->
    <div class="page-header">
      <h2 class="bs-purple">
        <i class="bi bi-receipt me-2"></i>
        訂單管理
      </h2>
    </div>

    <!-- 產品列表 -->
    <div class="products-container">
      <!-- 無訂單時顯示 -->
      <div v-if="orders.length === 0 && !isLoading" class="empty-state">
        <i class="bi bi-inbox"></i>
        <p>尚未有訂單資料</p>
      </div>

      <!-- 訂單表格 -->
      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th style="width: 180px">訂單編號</th>
              <th>購買人</th>
              <th style="width: 180px" class="text-center">下單時間</th>
              <th style="width: 120px" class="text-end">金額</th>
              <th style="width: 100px" class="text-center">付款狀態</th>
              <th style="width: 120px" class="text-center">編輯</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <!-- 訂單編號 -->
              <td>
                <small class="text-muted">{{ order.id }}</small>
              </td>

              <!-- 購買人 -->
              <td>
                <div class="order-user">{{ order.user?.name || '-' }}</div>
                <small class="text-muted" v-if="order.user?.email">
                  {{ order.user.email }}
                </small>
              </td>

              <!-- 下單時間 -->
              <td class="text-center">
                <small>{{ formatDate(order.create_at) }}</small>
              </td>

              <!-- 金額 -->
              <td class="text-end">
                <span class="fw-bold text-primary">
                  NT$ {{ formatPrice(order.total) }}
                </span>
              </td>

              <!-- 付款狀態 -->
              <td class="text-center">
                <div class="payment-status">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" :id="`payment-${order.id}`" :checked="order.is_paid"
                      @change="handlePaymentToggle(order)">
                    <label class="form-check-label" :for="`payment-${order.id}`">
                      <span class="badge" :class="order.is_paid ? 'bg-success' : 'bg-warning'">
                        {{ order.is_paid ? '已付款' : '未付款' }}
                      </span>
                    </label>
                  </div>
                </div>
              </td>

              <!-- 操作按鈕 -->
              <td class="text-center">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-primary" title="檢視訂單" @click="handleView(order)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn btn-outline-danger" title="刪除" @click="handleDelete(order)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 訂單統計資訊 -->
    <div v-if="orders.length > 0" class="orders-stats">
      <span class="text-muted mt-2 ms-2 d-block">
        共 <strong>{{ orders.length }}</strong> 筆訂單
      </span>
      <PaginationEl :pages="orderStore.pages" @emit-pages="orderStore.getOrders" />
    </div>
  </div>
  <OrderModal ref="orderModalRef" :order="selectedOrder" @update-order="handleUpdateOrder" />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useStatusStore } from '../../store/statusStore'
import { useOrderStore } from '../../store/orderStore'
import { showToast } from '../../composable/useToast'
import LoadingOverlay from '../../components/backstage/LoadingOverlay.vue'
import OrderModal from '../../components/backstage/OrderModal.vue'
import PaginationEl from '../../components/PaginationEl.vue'


// 使用 Pinia 狀態管理
const orderStore = useOrderStore()
const statusStore = useStatusStore()

// 使用 storeToRefs 取得響應式資料
const { orders } = storeToRefs(orderStore)
const { isLoading } = storeToRefs(statusStore)

// Modal 相關狀態
const orderModalRef = ref(null)
const selectedOrder = ref({})

// 頁面載入時取得訂單資料
onMounted(async () => {
  await orderStore.getOrders()
})

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 價格千分位格式化
const formatPrice = (price) => {
  if (!price && price !== 0) return 0
  return Number(price).toLocaleString('zh-TW')
}

// 查看訂單詳情
const handleView = (order) => {
  selectedOrder.value = { ...order }
  orderModalRef.value?.showModal()
}

// 刪除訂單
const handleDelete = async (order) => {
  if (!confirm(`確定要刪除訂單「${order.id}」嗎？`)) {
    return
  }
  const result = await orderStore.deleteOrders(order.id)
  if (result.success) {
    showToast('訂單刪除成功', 'success')
  } else {
    showToast(result.message || '訂單刪除失敗', 'error')
  }
}

// 處理訂單更新
const handleUpdateOrder = async (order) => {
  // TODO: 實作更新功能
  showToast('更新功能開發中', 'info')
  orderModalRef.value?.hideModal()
}

// 切換付款狀態
const handlePaymentToggle = async (order) => {
  const newStatus = !order.is_paid
  const statusText = newStatus ? '已付款' : '未付款'

  // 先更新本地狀態（樂觀更新）
  order.is_paid = newStatus

  // 調用後端 API 更新
  const result = await orderStore.updatePaid(order)

  if (result.success) {
    showToast(`付款狀態已更新為「${statusText}」`, 'success')
  } else {
    // 如果失敗，還原狀態
    order.is_paid = !newStatus
    showToast(result.message || '付款狀態更新失敗', 'error')
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

    /* 付款狀態切換 */
    .payment-status {
      display: flex;
      align-items: center;
      justify-content: center;

      .form-check {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        padding: 0;
      }

      .form-check-input {
        width: 2.5rem;
        height: 1.25rem;
        cursor: pointer;
        margin: 0;
        flex-shrink: 0;

        &:checked {
          background-color: #22c55e;
          border-color: #22c55e;
        }

        &:focus {
          box-shadow: 0 0 0 0.25rem rgba(34, 197, 94, 0.25);
        }
      }

      .form-check-label {
        cursor: pointer;
        margin: 0;
        display: flex;
        align-items: center;
      }

      .badge {
        font-size: 0.75rem;
        padding: 0.35rem 0.65rem;
        font-weight: 500;
      }
    }
  }
}
</style>