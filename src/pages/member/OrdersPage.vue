<template>
  <div class="orders-page">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-box-seam"></i>
        訂單查詢
      </h1>
      <p class="page-subtitle">查看您的所有訂單記錄（共 {{ orderCount }} 筆）</p>
    </div>

    <div class="orders-content">
      <!-- 空狀態 -->
      <div class="empty-state" v-if="orders.length === 0">
        <i class="bi bi-cart-x"></i>
        <h3>尚無訂單記錄</h3>
        <p>您還沒有任何訂單，趕快去<router-link to="/products/headphone">選購商品</router-link>吧！</p>
      </div>

      <!-- 訂單列表 -->
      <div class="orders-list" v-else>
        <div class="order-card" v-for="order in orders" :key="order.id">
          <div class="order-header">
            <div class="order-info">
              <div class="order-number">
                <span class="label">訂單編號：</span>
                <span class="value">{{ order.orderId || order.id }}</span>
              </div>
              <div class="order-date">
                <i class="bi bi-calendar3"></i>
                {{ formatDate(order.createAt || order.date) }}
              </div>
            </div>
            <div class="order-status" :class="getStatusClass(order)">
              {{ getStatusText(order) }}
            </div>
          </div>

          <!-- 訂單商品列表 -->
          <div class="order-items" v-if="order.items && order.items.length > 0">
            <div class="order-item" v-for="(item, index) in order.items" :key="item.product_id || item.id || index">
              <div class="item-image">
                <img :src="item.product?.imageUrl || item.imageUrl" :alt="item.product?.title || item.title">
              </div>
              <div class="item-info">
                <div class="item-name">{{ item.product?.title || item.title }}</div>
                <div class="item-quantity">數量：{{ item.qty || item.quantity }}</div>
              </div>
              <div class="item-price">NT$ {{ formatPrice(item.final_total || (item.price * (item.qty || item.quantity)))
              }}</div>
            </div>
          </div>

          <!-- 訂單金額詳情 -->
          <div class="order-summary">
            <div class="summary-row">
              <span>商品小計</span>
              <span>NT$ {{ formatPrice(calculateSubtotal(order)) }}</span>
            </div>
            <div class="summary-row" v-if="getDiscount(order) > 0">
              <span>折扣</span>
              <span class="discount">-NT$ {{ formatPrice(getDiscount(order)) }}</span>
            </div>
            <div class="summary-row">
              <span>運費</span>
              <span>NT$ {{ formatPrice(order.shippingFee || 0) }}</span>
            </div>
            <div class="summary-row total">
              <span>訂單總額</span>
              <span class="amount">NT$ {{ formatPrice(order.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useOrderStore } from '../../store/orderStore'
const orderStore = useOrderStore()

// 訂單資料
const orders = ref([])

const loadOrders = () => {
  const storedOrders = localStorage.getItem('memberOrders')
  if (storedOrders) {
    orders.value = JSON.parse(storedOrders)
  }
}

// 訂單數量
const orderCount = computed(() => orders.value.length)

// 格式化價格（安全處理 undefined）
const formatPrice = (value) => {
  if (value === undefined || value === null) return '0'
  return Number(value).toLocaleString('zh-TW')
}

// 計算訂單小計
const calculateSubtotal = (order) => {
  if (!order.items || order.items.length === 0) return 0
  return order.items.reduce((sum, item) => {
    return sum + (item.final_total || (item.price * (item.qty || item.quantity || 0)))
  }, 0)
}

// 取得折扣金額
const getDiscount = (order) => {
  return order.coupon?.discount || order.discount || 0
}

const getStatusText = (order) => {
  // 支援兩種資料格式：status.paid 或 is_paid
  const isPaid = order.status?.paid || order.is_paid
  return isPaid ? '已付款' : '未付款'
}

const getStatusClass = (order) => {
  // 支援兩種資料格式：status.paid 或 is_paid
  const isPaid = order.status?.paid || order.is_paid
  return isPaid ? 'status-paid' : 'status-unpaid'
}

const formatDate = (dateString) => {
  if (!dateString) return '無資料'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadOrders()
})
</script>

<style lang="scss" scoped>
.orders-page {
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
    color: #7030a0;
  }
}

.page-subtitle {
  color: #718096;
  font-size: 0.95rem;
  margin-left: 2.5rem;
}

.orders-content {
  min-height: 400px;
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

  h3 {
    font-size: 1.5rem;
    color: #4a5568;
    margin-bottom: 0.5rem;
  }

  p {
    color: #718096;
    margin-bottom: 2rem;
  }

  .shop-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    background: linear-gradient(135deg, #7030a0, #a855f7);
    color: white;
    text-decoration: none;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(112, 48, 160, 0.3);
    }
  }
}

/* 訂單列表 */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e0;
  }
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

.order-number {
  font-weight: 600;

  .label {
    color: #718096;
    font-size: 0.9rem;
  }

  .value {
    color: #2d3748;
    font-size: 1rem;
  }
}

.order-status {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;

  &.status-paid {
    background: #d1fae5;
    color: #065f46;
  }

  &.status-unpaid {
    background: #fef3c7;
    color: #92400e;
  }
}

.order-date {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.order-total {
  color: #4a5568;
  font-size: 0.95rem;

  .amount {
    font-size: 1.25rem;
    font-weight: 700;
    color: #7030a0;
    margin-left: 0.5rem;
  }
}

.order-items {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 12px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 0.75rem;
  }
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.item-quantity {
  font-size: 0.875rem;
  color: #718096;
}

.item-price {
  font-weight: 600;
  color: #7030a0;
}

.order-summary {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e2e8f0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;

  &.total {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #e2e8f0;
    font-size: 1.125rem;
    font-weight: 700;
  }

  .discount {
    color: #22c55e;
  }

  .amount {
    color: #7030a0;
    font-size: 1.25rem;
  }
}
</style>