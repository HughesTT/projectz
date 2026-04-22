<template>
  <div class="modal fade" id="CouponModal" tabindex="-1" aria-labelledby="CouponModalLabel" aria-hidden="true"
    ref="modal">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title" id="exampleModalLabel">
            <i class="bi bi-receipt-cutoff"></i>
            {{ isNew ? '新增優惠券' : '編輯優惠券' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label for="title" class="form-label">優惠券名稱 *</label>
                <input type="text" class="form-control" id="title" v-model="tempCoupon.title" placeholder="請輸入優惠券名稱"
                  required>
              </div>

              <div class="mb-3">
                <label for="code" class="form-label">優惠券代碼 *</label>
                <input type="text" class="form-control" id="code" v-model="tempCoupon.code"
                  placeholder="請輸入優惠券代碼（例如：SUMMER2026）" required>
              </div>

              <div class="mb-3">
                <label for="percent" class="form-label">折扣百分比 *</label>
                <div class="input-group">
                  <input type="number" class="form-control" id="percent" v-model.number="tempCoupon.percent"
                    placeholder="請輸入折扣百分比" min="1" max="100" required>
                  <span class="input-group-text">%</span>
                </div>
                <small class="text-muted">範圍：1-100</small>
              </div>
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label for="due_date" class="form-label">到期日期</label>
                <input type="date" class="form-control" id="due_date" v-model="dueDateFormatted">
                <small class="text-muted">留空表示無期限</small>
              </div>

              <div class="mb-3 form-check form-switch">
                <input type="checkbox" class="form-check-input" id="is_enabled" v-model="tempCoupon.is_enabled">
                <label class="form-check-label" for="is_enabled">啟用優惠券</label>
              </div>
            </div>

            <div class="col-12">
              <div class="mb-3">
                <label for="description" class="form-label">優惠券描述</label>
                <textarea class="form-control" id="description" v-model="tempCoupon.description" placeholder="請輸入優惠券描述"
                  rows="3"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">關閉</button>
          <button type="button" class="btn btn-primary" @click="handleSubmit">儲存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { Modal } from 'bootstrap'

const tempCoupon = reactive({
  title: '',
  code: '',
  percent: 0,
  due_date: null,
  is_enabled: true,
  description: ''
})

const isNew = ref(true)
const modal = ref(null)
let bsModal = null

const props = defineProps({
  coupon: {
    type: Object,
    default: () => ({})
  },
  isNew: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-coupon'])

// 日期格式轉換：timestamp to YYYY-MM-DD
const dueDateFormatted = computed({
  get() {
    if (!tempCoupon.due_date) return ''
    const date = new Date(tempCoupon.due_date * 1000)
    return date.toISOString().split('T')[0]
  },
  set(value) {
    if (!value) {
      tempCoupon.due_date = null
    } else {
      tempCoupon.due_date = Math.floor(new Date(value).getTime() / 1000)
    }
  }
})

// 監聽 coupon prop 的變化
watch(
  () => props.coupon,
  (newCoupon) => {
    if (newCoupon && newCoupon.id) {
      // 編輯模式：複製現有優惠券資料
      Object.assign(tempCoupon, {
        id: newCoupon.id,
        title: newCoupon.title || '',
        code: newCoupon.code || '',
        percent: newCoupon.percent || 0,
        due_date: newCoupon.due_date || null,
        is_enabled: Boolean(newCoupon.is_enabled), // 轉換為布林值（處理 0/1 或 true/false）
        description: newCoupon.description || ''
      })
    } else {
      // 新增模式：重置表單
      Object.assign(tempCoupon, {
        title: '',
        code: '',
        percent: 0,
        due_date: null,
        is_enabled: true,
        description: ''
      })
      delete tempCoupon.id
    }
  },
  { immediate: true, deep: true }
)

const showModal = () => {
  if (!bsModal && modal.value) {
    bsModal = new Modal(modal.value)
  }
  bsModal?.show()
}

const hideModal = () => {
  bsModal?.hide()
}

// 處理提交數據，確保格式正確
const handleSubmit = () => {
  // 將布林值轉換為數字（0 或 1）以符合後端 API
  const submitData = {
    ...tempCoupon,
    is_enabled: tempCoupon.is_enabled ? 1 : 0
  }
  emit('update-coupon', submitData)
}

defineExpose({
  showModal,
  hideModal
})
</script>

<style lang="scss" scoped>
// Modal 整體樣式
.modal-content {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: none;
}

// Modal 標題區
.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem 2rem;

  .modal-title {
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;

    i {
      margin-right: 0.5rem;
    }
  }

  .btn-close {
    filter: brightness(0) invert(1);
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
}

// Modal 內容區
.modal-body {
  padding: 2rem;
  background: #f8f9fa;

  .form-label {
    font-weight: 600;
    color: #495057;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  .form-control,
  .input-group {
    border-radius: 8px;

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
  }

  .input-group-text {
    background: #e9ecef;
    border-left: none;
    font-weight: 600;
    color: #667eea;
  }

  .form-check-input {
    width: 3rem;
    height: 1.5rem;

    &:checked {
      background-color: #667eea;
      border-color: #667eea;
    }
  }

  .form-check-label {
    margin-left: 0.5rem;
    font-weight: 500;
  }

  small.text-muted {
    font-size: 0.85rem;
    display: block;
    margin-top: 0.25rem;
  }
}

// Modal 底部按鈕區
.modal-footer {
  background: white;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  gap: 0.75rem;

  .btn {
    padding: 0.625rem 1.5rem;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.3s ease;

    &.btn-secondary {
      border-color: #cbd5e0;
      color: #4a5568;

      &:hover {
        background: #f7fafc;
        border-color: #a0aec0;
        color: #2d3748;
      }
    }

    &.btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
    }
  }
}

// 響應式設計
@media (max-width: 768px) {
  .modal-body {
    padding: 1.25rem;
  }
}
</style>