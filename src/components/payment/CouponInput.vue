<template>
  <div class="coupon-section">
    <div class="coupon-header">
      <i class="bi bi-ticket-perforated"></i>
      <span>使用折價券</span>
    </div>

    <!-- 已套用的優惠券 -->
    <div v-if="appliedCoupon" class="applied-coupon">
      <div class="coupon-badge">
        <i class="bi bi-check-circle-fill"></i>
        <div class="coupon-details">
          <div class="coupon-code">{{ appliedCoupon.code }}</div>
          <div class="coupon-description">{{ appliedCoupon.title }}</div>
        </div>
      </div>
      <button class="remove-coupon-btn" @click="$emit('remove')">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <!-- 優惠券輸入 -->
    <div v-else class="coupon-input-group">
      <input v-model="localCouponCode" type="text" class="coupon-input" placeholder="請輸入折價券代碼"
        @keyup.enter="handleApply" />
      <button class="apply-coupon-btn" @click="handleApply" :disabled="!localCouponCode.trim()">
        套用
      </button>
    </div>

    <!-- 提示訊息 -->
    <div v-if="!appliedCoupon" class="coupon-hint">
      <i class="bi bi-info-circle"></i>
      <span>輸入折價券代碼即可享受優惠</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  couponCode: {
    type: String,
    default: ''
  },
  appliedCoupon: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:couponCode', 'apply', 'remove'])

const localCouponCode = ref(props.couponCode)

watch(() => props.couponCode, (newVal) => {
  localCouponCode.value = newVal
})

watch(localCouponCode, (newVal) => {
  emit('update:couponCode', newVal)
})

const handleApply = () => {
  if (localCouponCode.value.trim()) {
    emit('apply', localCouponCode.value.trim())
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #7030a0;

.coupon-section {
  background: linear-gradient(135deg, #f7f5ff 0%, #fff 100%);
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.coupon-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: $primary-color;
  margin-bottom: 1rem;
  font-size: 1rem;

  i {
    font-size: 1.25rem;
  }
}

.applied-coupon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 2px solid #d4f4dd;
  border-radius: 8px;
  padding: 1rem;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.coupon-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  i {
    color: #48bb78;
    font-size: 1.5rem;
  }
}

.coupon-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.coupon-code {
  font-weight: 700;
  color: $primary-color;
  font-size: 1rem;
}

.coupon-description {
  font-size: 0.875rem;
  color: #718096;
}

.remove-coupon-btn {
  padding: 0.5rem;
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #fff5f5;
  }
}

.coupon-input-group {
  display: flex;
  gap: 0.75rem;
}

.coupon-input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba(112, 48, 160, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
}

.apply-coupon-btn {
  padding: 0.875rem 1.5rem;
  background: $primary-color;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #5a2580;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(112, 48, 160, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.coupon-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #718096;

  i {
    color: $primary-color;
  }
}
</style>
