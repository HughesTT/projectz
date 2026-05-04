<template>
  <div class="coupon-page">
    <LoadingOverlay :active="isLoading" color="#7030a0" message="讀取中..." />

    <!-- 頁面標題 -->
    <div class="page-header">
      <h2 class="bs-purple">
        <i class="bi bi-ticket-perforated me-2"></i>
        優惠券管理
      </h2>
      <button class="btn btn-purple" @click="handleCreate">
        <i class="bi bi-plus-lg me-2"></i>
        新增優惠券
      </button>
    </div>

    <!-- 優惠券列表 -->
    <div class="coupons-container">
      <!-- 無優惠券時顯示 -->
      <div v-if="coupons.length === 0 && !isLoading" class="empty-state">
        <i class="bi bi-inbox"></i>
        <p>尚未有優惠券資料</p>
      </div>

      <!-- 優惠券表格 -->
      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>優惠券名稱</th>
              <th>折扣</th>
              <th>使用期限</th>
              <th>啟用狀態</th>
              <th>編輯</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="coupon in coupons" :key="coupon.id">
              <!-- 優惠券名稱 -->
              <td>
                <div class="product-title">{{ coupon.title }}</div>
                <small class="text-muted" v-if="coupon.description">
                  {{ truncateText(coupon.description, 50) }}
                </small>
              </td>

              <!-- 折扣 -->
              <td>
                <span class="badge-status badge bg-info" v-if="coupon.percent">
                  {{ coupon.percent }}%
                </span>
                <span v-else class="text-muted">無</span>
              </td>

              <!-- 使用期限 -->
              <td>
                <small v-if="coupon.due_date">
                  {{ formatDate(coupon.due_date) }}
                </small>
                <small v-else class="text-muted">無期限</small>
              </td>
              <!-- 啟用狀態 -->
              <td>
                <span class="badge-status badge" :class="!!coupon.is_enabled ? 'bg-success' : 'bg-danger'">
                  {{ !!coupon.is_enabled ? '啟用' : '停用' }}
                </span>
              </td>

              <!-- 操作按鈕 -->
              <td class="text-center">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-primary" title="編輯" @click="handleEdit(coupon)">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-outline-danger" title="刪除" @click="handleDelete(coupon)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 優惠券統計資訊 -->
    <div v-if="coupons.length > 0" class="coupons-stats">
      <span class="text-muted mt-2 ms-2 d-block">
        共 <strong>{{ coupons.length }}</strong> 筆優惠券
      </span>
      <PaginationEl :pages="pages" @emit-pages="getCoupons" />
    </div>
  </div>

  <!-- 優惠券 Modal -->
  <CouponModal ref="couponModalRef" :coupon="selectedCoupon" :isNew="isNewCoupon" @update-coupon="handleUpdateCoupon" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStatusStore } from '../../store/statusStore'
import { useCouponStore } from '../../store/couponStore'
import { showToast } from '../../composable/useToast'
import LoadingOverlay from '../../components/backstage/LoadingOverlay.vue'
import PaginationEl from '../../components/PaginationEl.vue'
import CouponModal from '../../components/backstage/CouponModal.vue'

// 使用 Pinia 狀態管理
const statusStore = useStatusStore()
const couponStore = useCouponStore()

// 使用 storeToRefs 取得響應式資料
const { isLoading } = storeToRefs(statusStore)
const { coupons, pages } = storeToRefs(couponStore)

// Modal 相關狀態
const couponModalRef = ref(null)
const selectedCoupon = ref({})
const isNewCoupon = ref(false)

// 頁面載入時取得優惠券資料
onMounted(async () => {
  await couponStore.getCoupons()
})

// 取得優惠券列表（分頁）
const getCoupons = async (page = 1) => {
  await couponStore.getCoupons(page)
}

// 新增優惠券
const handleCreate = () => {
  selectedCoupon.value = {}
  isNewCoupon.value = true
  couponModalRef.value?.showModal()
}

// 編輯優惠券
const handleEdit = (coupon) => {
  selectedCoupon.value = { ...coupon }
  isNewCoupon.value = false
  couponModalRef.value?.showModal()
}

// 刪除優惠券
const handleDelete = async (coupon) => {
  if (!confirm(`確定要刪除優惠券「${coupon.title}」嗎？`)) {
    return
  }

  const result = await couponStore.deleteCoupon(coupon.id)

  if (result.success) {
    showToast('優惠券已刪除', 'success')
  } else {
    showToast(result.message || '刪除失敗', 'error')
  }
}

// 處理優惠券更新/新增
const handleUpdateCoupon = async (couponData) => {

  const result = await couponStore.updateCoupon(couponData)

  if (result.success) {
    showToast(isNewCoupon.value ? '優惠券已新增' : '優惠券已更新', 'success')
    couponModalRef.value?.hideModal()
  } else {
    showToast(result.message || '儲存失敗', 'error')
  }
}

// 文字截斷
const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

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
</script>

<style lang="scss" scoped>
.coupon-page {
  padding: 0 2rem;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e2e8f0;

    h2 {
      margin: 0;
      color: #2d3748;
      font-weight: 600;
      display: flex;
      align-items: center;
    }

    .btn-purple {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.625rem 1.5rem;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
    }
  }

  .coupons-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    /* 空狀態 */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #a0aec0;

      i {
        font-size: 4rem;
        display: block;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.1rem;
        margin: 0;
      }
    }

    /* 表格樣式 */
    .table {
      margin-bottom: 0;

      thead {
        background: #f7fafc;

        th {
          border-bottom: 2px solid #e2e8f0;
          color: #4a5568;
          font-weight: 600;
          padding: 1rem 0.75rem;
        }
      }

      tbody {
        td {
          vertical-align: middle;
          padding: 1rem 0.75rem;

          .badge-status {
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
          }
        }

        tr {
          transition: background-color 0.2s;

          &:hover {
            background-color: #f7fafc;
          }
        }
      }
    }

    .product-title {
      font-weight: 500;
      color: #2d3748;
      margin-bottom: 0.25rem;
    }

    /* 按鈕群組 */
    .btn-group-sm>.btn {
      padding: 0.375rem 0.75rem;
    }
  }

  .coupons-stats {
    padding: 1rem 1.5rem;
    background: #f7fafc;
    border-top: 1px solid #e2e8f0;
    margin-top: 1rem;
  }
}

.bs-purple {
  color: #7030a0;
}
</style>