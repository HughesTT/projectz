<template>
  <div class="order-summary">
    <h3 class="summary-title">
      <i class="bi bi-receipt"></i>
      結帳明細
    </h3>

    <!-- 商品列表 -->
    <div class="summary-items">
      <div v-for="item in items" :key="item.id" class="summary-item">
        <img :src="item.imageUrl" :alt="item.title" class="item-image" @error="handleImageError" />
        <div class="item-details">
          <div class="item-name">{{ item.title }}</div>
          <div class="item-quantity">數量: {{ item.quantity }}</div>
        </div>
        <div class="item-price">
          NT$ {{ (item.price * item.quantity).toLocaleString() }}
        </div>
      </div>
    </div>

    <div class="summary-divider"></div>

    <!-- 價格明細 -->
    <div class="summary-calculations">
      <div class="summary-row">
        <span class="summary-label">小計</span>
        <span class="summary-value">NT$ {{ cartTotal.toLocaleString() }}</span>
      </div>

      <div v-if="discountAmount > 0" class="summary-row discount-row">
        <span class="summary-label">
          <i class="bi bi-ticket-perforated"></i>
          優惠折扣
        </span>
        <span class="summary-value discount">-NT$ {{ discountAmount.toLocaleString() }}</span>
      </div>

      <div class="summary-row">
        <span class="summary-label">運費</span>
        <span class="summary-value">
          <span v-if="shippingFee === 0" class="free-shipping">免運費</span>
          <span v-else>NT$ {{ shippingFee.toLocaleString() }}</span>
        </span>
      </div>
    </div>

    <div class="summary-divider"></div>

    <!-- 總計 -->
    <div class="summary-row total-row">
      <span class="summary-label total-label">總計</span>
      <span class="summary-value total-amount">NT$ {{ finalTotal.toLocaleString() }}</span>
    </div>

    <!-- 結帳按鈕 -->
    <button class="checkout-btn" @click="$emit('checkout')">
      <i class="bi bi-lock-fill"></i>
      確認付款
    </button>

    <!-- 安全提示 -->
    <div class="security-note">
      <i class="bi bi-shield-check"></i>
      <span>我們使用安全加密技術保護您的付款資訊</span>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  cartTotal: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  finalTotal: {
    type: Number,
    required: true
  }
})

defineEmits(['checkout'])

// 監控價格數據，方便除錯
// watch(() => [props.cartTotal, props.discountAmount, props.shippingFee, props.finalTotal],
//   ([cartTotal, discountAmount, shippingFee, finalTotal]) => {
//     console.log('📊 OrderSummary 接收到的數據:', {
//       cartTotal,
//       discountAmount,
//       shippingFee,
//       finalTotal,
//       計算驗證: `${cartTotal} - ${discountAmount} + ${shippingFee} = ${cartTotal - discountAmount + shippingFee}`
//     })
//   },
//   { immediate: true }
// )

const handleImageError = (event) => {
  event.target.src = '/img/default_img.png'
}
</script>

<style lang="scss" scoped>
$primary-color: #7030a0;

.order-summary {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  position: sticky;
  top: 20px;
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

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 10px;

    &:hover {
      background: #a0aec0;
    }
  }
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 8px;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0.25rem;
}

.item-quantity {
  font-size: 0.85rem;
  color: #718096;
}

.item-price {
  font-weight: 600;
  color: $primary-color;
  font-size: 0.95rem;
  white-space: nowrap;
}

.summary-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  margin: 1rem 0;
}

.summary-calculations {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;

  &.discount-row {
    .summary-label {
      color: #38a169;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      i {
        font-size: 1rem;
      }
    }
  }

  &.total-row {
    margin-top: 0.5rem;
    padding-top: 0.75rem;
    border-top: 2px solid #e2e8f0;
  }
}

.summary-label {
  color: #4a5568;
  font-weight: 500;

  &.total-label {
    font-size: 1.1rem;
    font-weight: 700;
    color: #2d3748;
  }
}

.summary-value {
  font-weight: 600;
  color: #2d3748;

  &.discount {
    color: #38a169;
  }

  &.total-amount {
    font-size: 1.5rem;
    color: $primary-color;
    font-weight: 700;
  }
}

.free-shipping {
  color: #38a169;
  font-weight: 600;
  font-size: 0.9rem;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  background: linear-gradient(135deg, $primary-color, #a855f7);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(112, 48, 160, 0.3);

  i {
    font-size: 1.2rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(112, 48, 160, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

.security-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #edf2f7;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #4a5568;

  i {
    color: #38a169;
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .order-summary {
    position: static;
  }

  .summary-items {
    max-height: 200px;
  }
}
</style>
