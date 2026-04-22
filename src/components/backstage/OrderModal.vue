<template>
  <div class="modal fade" id="orderModal" tabindex="-1" role="dialog" aria-labelledby="orderModalLabel"
    aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title" id="exampleModalLabel">
            <i class="bi bi-receipt-cutoff"></i>
            <span>訂單資料</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="userbox col-md-4">
              <h3>訂購人資料</h3>
              <table v-if="tempOrder.user">
                <tr>
                  <th style="width:100px;">姓名</th>
                  <td>{{ tempOrder.user.name }}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{{ tempOrder.user.email }}</td>
                </tr>
                <tr>
                  <th>電話</th>
                  <td>{{ tempOrder.user.tel }}</td>
                </tr>
                <tr>
                  <th>地址</th>
                  <td>{{ tempOrder.user.address }}</td>
                </tr>
              </table>
            </div>
            <div class="orderbox col-md-8">
              <h3>訂單內容</h3>
              <table class="table">
                <tbody>
                  <tr>
                    <th style="width:100px;">訂單編號</th>
                    <td>{{ tempOrder.id }}</td>
                  </tr>
                  <tr>
                    <th>下單時間</th>
                    <td>{{ formatDate(tempOrder.create_at) }}</td>
                  </tr>
                  <tr>
                    <th>付款時間</th>
                    <td>
                      <span v-if="tempOrder.paid_date">
                        {{ formatDate(tempOrder.paid_date) }}
                      </span>
                      <span v-else>尚未付款</span>
                    </td>
                  </tr>
                  <tr>
                    <th>總金額</th>
                    <td>{{ formatCurrency(tempOrder.total) }}</td>
                  </tr>
                </tbody>
              </table>
              <h3>選購商品</h3>
              <table class="table">
                <thead>
                  <tr></tr>
                </thead>
                <tbody>
                  <tr v-for="item in tempOrder.products" :key="item.id">
                    <th>{{ item.product?.title || '商品名稱' }}</th>
                    <td>數量 : {{ item.qty }}</td>
                    <td class="text-end">
                      {{ formatCurrency(item.final_total) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button class="btn btn-primary" data-bs-dismiss="modal">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Modal } from 'bootstrap'

const tempOrder = ref({
  user: {},
  products: []
})
const isPaid = ref(false)
const modal = ref(null)
let bsModal = null

const props = defineProps({
  order: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update-order'])

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp * 1000) // Unix timestamp 轉換
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 格式化金額
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'NT$ 0'
  return `NT$ ${Number(amount).toLocaleString('zh-TW')}`
}

watch(() => props.order, (newOrder) => {
  if (newOrder && Object.keys(newOrder).length > 0) {
    tempOrder.value = JSON.parse(JSON.stringify(newOrder))
    isPaid.value = tempOrder.value.is_paid
  }
}, { immediate: true, deep: true })

// 顯示 Modal
const showModal = () => {
  if (!bsModal && modal.value) {
    bsModal = new Modal(modal.value)
  }
  bsModal?.show()
}

// 隱藏 Modal
const hideModal = () => {
  bsModal?.hide()
}

defineExpose({
  showModal,
  hideModal
})
</script>

<style lang="scss" scoped>
// Modal 整體樣式
.modal-dialog {
  margin-top: 3rem;
}

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

  .row {
    margin: -0.75rem;

    >div {
      padding: 0.75rem;
    }
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e2e8f0;
    display: flex;
    align-items: center;

    &::before {
      content: "";
      width: 4px;
      height: 1.2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin-right: 0.75rem;
      border-radius: 2px;
    }
  }
}

// 訂購人資料框
.userbox {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  table {
    width: 100%;

    tr {
      border-bottom: 1px solid #f1f3f5;

      &:last-child {
        border-bottom: none;
      }
    }

    th {
      font-weight: 600;
      color: #495057;
      padding: 0.75rem 0.5rem;
      font-size: 0.9rem;
      vertical-align: top;
    }

    td {
      color: #212529;
      padding: 0.75rem 0.5rem;
      word-break: break-word;
    }
  }
}

// 訂單內容框
.orderbox {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .table {
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }

    tbody {
      tr {
        border-bottom: 1px solid #f1f3f5;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background-color: #f8f9fa;
        }
      }

      th {
        font-weight: 600;
        color: #495057;
        padding: 0.875rem;
        font-size: 0.9rem;
        width: 120px;
      }

      td {
        color: #212529;
        padding: 0.875rem;

        &.text-end {
          font-weight: 600;
          color: #667eea;
        }
      }
    }
  }

  // 商品列表特殊樣式
  h3+.table {
    thead {
      display: none;
    }

    tbody tr {
      th {
        color: #2d3748;
        font-weight: 500;
      }
    }
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

    &.btn-outline-secondary {
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
  .modal-dialog {
    margin: 1rem;
  }

  .modal-body {
    padding: 1.25rem;

    .userbox,
    .orderbox {
      padding: 1rem;
    }

    h3 {
      font-size: 1rem;
    }
  }
}
</style>