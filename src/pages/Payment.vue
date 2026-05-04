<template>
  <div class="payment-page">
    <!-- 步驟指示器 -->
    <CheckoutSteps :current-step="currentStep" />

    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-credit-card"></i>
        付款結帳
      </h1>
      <p class="page-subtitle">請確認您的訂單資訊並完成付款</p>
    </div>

    <div class="payment-content">
      <LoadingOverlay :active="isLoading" />

      <!-- 購物車為空 -->
      <EmptyCart v-if="cart.length === 0" />

      <!-- 結帳內容 -->
      <div v-else class="checkout-container">
        <!-- 左側：付款資訊 -->
        <div class="payment-info">
          <!-- 優惠券輸入 -->
          <CouponInput v-model:coupon-code="couponCode" :applied-coupon="appliedCoupon" @apply="handleApplyCoupon"
            @remove="handleRemoveCoupon" />

          <!-- 購買人資訊表單 -->
          <BuyerInfoForm v-model="buyerInfo" />

          <!-- 信用卡資訊表單 -->
          <CreditCardForm v-model="cardInfo" />
        </div>

        <!-- 右側：訂單摘要 -->
        <OrderSummary :items="cart" :cart-total="cartTotal" :discount-amount="discountAmount"
          :shipping-fee="shippingFee" :final-total="finalTotal" @checkout="handleCheckout" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useStatusStore } from '../store/statusStore'
import { useCart } from '../composable/useCart'
import { useCheckout } from '../composable/useCheckout'
import { showToast } from '../composable/useToast'

// 元件引入
import CheckoutSteps from '../components/payment/CheckoutSteps.vue'
import CouponInput from '../components/payment/CouponInput.vue'
import BuyerInfoForm from '../components/payment/BuyerInfoForm.vue'
import CreditCardForm from '../components/payment/CreditCardForm.vue'
import OrderSummary from '../components/payment/OrderSummary.vue'
import EmptyCart from '../components/payment/EmptyCart.vue'
import LoadingOverlay from '../components/backstage/LoadingOverlay.vue'

const router = useRouter()
const statusStore = useStatusStore()
const { isLoading } = storeToRefs(statusStore)
const { cart, cartTotal, getCart } = useCart()
const { appliedCoupon, applyCoupon, removeCoupon, createOrder } = useCheckout()

// 初始化購物車
getCart()

// 狀態管理
const currentStep = ref(1)
const couponCode = ref('')
const buyerInfo = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  note: ''
})
const cardInfo = ref({
  number: '',
  name: '',
  expiry: '',
  cvv: ''
})

// 運費計算
const shippingFee = computed(() => cartTotal.value > 499 ? 0 : 100)

// 折扣計算
const discountAmount = computed(() => {
  if (!appliedCoupon.value || !appliedCoupon.value.discountAmount) {
    return 0
  }
  const discount = Number(appliedCoupon.value.discountAmount) || 0
  return discount
})

// 計算總金額
const finalTotal = computed(() => {
  const total = Number(cartTotal.value) || 0
  const discount = Number(discountAmount.value) || 0
  const shipping = Number(shippingFee.value) || 0

  // 計算公式：商品小計 - 折扣 + 運費
  const finalAmount = total - discount + shipping

  return isNaN(finalAmount) ? 0 : Math.max(0, finalAmount)
})

// 事件處理
const handleApplyCoupon = async (code) => {
  await applyCoupon(code)
}

const handleRemoveCoupon = () => {
  removeCoupon()
  couponCode.value = ''
}

const validateForm = () => {
  if (!buyerInfo.value.name.trim()) {
    showToast('請輸入姓名', 'warning')
    return false
  }
  if (!buyerInfo.value.phone.trim()) {
    showToast('請輸入電話', 'warning')
    return false
  }
  if (!buyerInfo.value.email.trim()) {
    showToast('請輸入電子郵件', 'warning')
    return false
  }
  if (!buyerInfo.value.address.trim()) {
    showToast('請輸入地址', 'warning')
    return false
  }
  if (!cardInfo.value.number.trim()) {
    showToast('請輸入信用卡號', 'warning')
    return false
  }
  if (!cardInfo.value.name.trim()) {
    showToast('請輸入持卡人姓名', 'warning')
    return false
  }
  if (!cardInfo.value.expiry.trim()) {
    showToast('請輸入有效期限', 'warning')
    return false
  }
  if (!cardInfo.value.cvv.trim()) {
    showToast('請輸入安全碼', 'warning')
    return false
  }
  return true
}

const handleCheckout = async () => {
  if (!validateForm()) return

  const orderData = {
    user: {
      name: buyerInfo.value.name,
      email: buyerInfo.value.email,
      tel: buyerInfo.value.phone,
      address: buyerInfo.value.address
    },
    message: buyerInfo.value.note || ''
  }

  // 傳遞額外資訊供 localStorage 儲存
  const additionalInfo = {
    cardInfo: cardInfo.value,
    shippingFee: shippingFee.value,
    finalTotal: finalTotal.value
  }

  const result = await createOrder(orderData, additionalInfo)

  if (result.success) {
    currentStep.value = 2
    setTimeout(() => {
      router.push('/member/orders')
    }, 1500)
  }
}
</script>

<style lang="scss" scoped>
.payment-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
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
  margin: 0 0 0.5rem 0;

  i {
    color: #7030a0;
  }
}

.page-subtitle {
  color: #718096;
  margin: 0;
  font-size: 0.95rem;
}

.checkout-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .checkout-container {
    grid-template-columns: 1fr;
  }
}
</style>
