<template>
  <!-- 結帳步驟指示器 -->
  <div class="checkout-steps">
    <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
      <div class="step-number">
        <i v-if="currentStep > 1" class="bi bi-check-lg"></i>
        <span v-else>1</span>
      </div>
      <div class="step-info">
        <div class="step-title">填寫付款資料</div>
        <div class="step-description">輸入購買人與付款資訊</div>
      </div>
    </div>
    <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
    <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
      <div class="step-number">
        <i v-if="currentStep > 2" class="bi bi-check-lg"></i>
        <span v-else>2</span>
      </div>
      <div class="step-info">
        <div class="step-title">付款完成</div>
        <div class="step-description">確認訂單並完成付款</div>
      </div>
    </div>
  </div>
  <div class="payment-page">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-credit-card"></i>
        付款結帳
      </h1>
      <p class="page-subtitle">請確認您的訂單資訊並完成付款</p>
    </div>

    <div class="payment-content">
      <LoadingOverlay :active="isLoading" loader="spinner" color="#7030a0" message="處理中..." />

      <!-- 購物車為空的狀態 -->
      <div v-if="cart.length === 0" class="empty-state">
        <i class="bi bi-cart-x"></i>
        <h3>購物車是空的</h3>
        <p>目前購物車中沒有商品，請先<router-link to="/products/headphone">選購商品</router-link></p>
      </div>

      <!-- 結帳內容 -->
      <div v-else class="checkout-container">
        <!-- 左側：付款資訊 -->
        <div class="payment-info">
          <div class="payment-card">
            <h2 class="card-title">
              <i class="bi bi-wallet2"></i>
              付款資訊
            </h2>

            <!-- 購買人資訊 -->
            <div class="info-section">
              <h3 class="section-subtitle">
                <i class="bi bi-person-circle"></i>
                購買人資訊
              </h3>
              <div class="form-grid">
                <div class="form-group">
                  <label for="name">姓名 <span class="required">*</span></label>
                  <input type="text" id="name" v-model="buyerInfo.name" placeholder="請輸入姓名">
                </div>
                <div class="form-group">
                  <label for="phone">電話 <span class="required">*</span></label>
                  <input type="tel" id="phone" v-model="buyerInfo.phone" placeholder="請輸入聯絡電話">
                </div>
                <div class="form-group">
                  <label for="email">電子郵件 <span class="required">*</span></label>
                  <input type="email" id="email" v-model="buyerInfo.email" placeholder="請輸入電子郵件">
                </div>
                <div class="form-group full-width">
                  <label for="address">地址 <span class="required">*</span></label>
                  <input type="text" id="address" v-model="buyerInfo.address" placeholder="請輸入配送地址">
                </div>
                <div class="form-group full-width">
                  <label for="note">備註</label>
                  <textarea id="note" v-model="buyerInfo.note" rows="2" placeholder="訂單備註（選填）"></textarea>
                </div>
              </div>
            </div>

            <div class="section-divider"></div>

            <!-- 折價券 -->
            <div class="info-section">
              <h3 class="section-subtitle">
                <i class="bi bi-ticket-perforated"></i>
                折價券
              </h3>
              <div class="coupon-input-group">
                <input type="text" v-model="couponCode" placeholder="請輸入折價券代碼" :disabled="appliedCoupon !== null">
                <button class="btn-apply-coupon" @click="applyCoupon" :disabled="appliedCoupon !== null">
                  {{ appliedCoupon ? '已套用' : '套用' }}
                </button>
              </div>
              <div v-if="appliedCoupon" class="coupon-applied">
                <i class="bi bi-check-circle-fill"></i>
                <span>已套用折價券：{{ appliedCoupon.title }} (-{{ appliedCoupon.percent }}%)</span>
                <button class="btn-remove-coupon" @click="removeCoupon">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>

            <div class="section-divider"></div>

            <!-- 信用卡資訊 -->
            <div class="info-section">
              <h3 class="section-subtitle">
                <i class="bi bi-credit-card-2-front"></i>
                信用卡資訊
              </h3>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label for="cardNumber">信用卡號 <span class="required">*</span></label>
                  <input type="text" id="cardNumber" v-model="cardInfo.number" placeholder="1234 5678 9012 3456"
                    maxlength="19" @input="formatCardNumber">
                </div>
                <div class="form-group">
                  <label for="cardName">持卡人姓名 <span class="required">*</span></label>
                  <input type="text" id="cardName" v-model="cardInfo.name" placeholder="如卡片上所示">
                </div>
                <div class="form-group">
                  <label for="expiryDate">有效期限 <span class="required">*</span></label>
                  <input type="text" id="expiryDate" v-model="cardInfo.expiry" placeholder="MM/YY" maxlength="5"
                    @input="formatExpiry">
                </div>
                <div class="form-group">
                  <label for="cvv">安全碼 (CVV) <span class="required">*</span></label>
                  <input type="text" id="cvv" v-model="cardInfo.cvv" placeholder="123" maxlength="3">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側：訂單明細 -->
        <div class="order-summary-wrapper">
          <div class="order-summary">
            <h2 class="summary-title">
              <i class="bi bi-receipt"></i>
              結帳明細
            </h2>

            <!-- 商品列表 -->
            <div class="summary-items">
              <div class="summary-item" v-for="item in cart" :key="item.id">
                <div class="item-image-small">
                  <img :src="item.imageUrl" :alt="item.title" @error="handleImageError">
                </div>
                <div class="item-details">
                  <p class="item-name">{{ item.title }}</p>
                  <p class="item-quantity">數量：{{ item.quantity }}</p>
                </div>
                <div class="item-price">
                  NT$ {{ (item.price * item.quantity).toLocaleString() }}
                </div>
              </div>
            </div>

            <div class="summary-divider"></div>

            <!-- 價格明細 -->
            <div class="summary-row">
              <span class="summary-label">商品小計</span>
              <span class="summary-value">NT$ {{ cartTotal.toLocaleString() }}</span>
            </div>
            <div class="summary-row" v-if="appliedCoupon">
              <span class="summary-label">折價券折扣</span>
              <span class="summary-value discount">-NT$ {{ discountAmount.toLocaleString() }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">運費</span>
              <span class="summary-value">NT$ {{ shippingFee.toLocaleString() }}</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row total-row">
              <span class="summary-label">總計</span>
              <span class="summary-value total-amount">NT$ {{ finalTotal.toLocaleString() }}</span>
            </div>

            <!-- 確認付款按鈕 -->
            <button class="btn-checkout" @click="handleCheckout">
              <i class="bi bi-lock-fill"></i>
              <span>確認付款</span>
            </button>

            <p class="payment-notice">
              <i class="bi bi-shield-check"></i>
              您的付款資訊經過加密保護
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useStatusStore } from '../store/statusStore'
import { useCart } from '../composable/useCart'
import { useCouponStore } from '../store/couponStore'
import { useOrderStore } from '../store/orderStore'
import { showToast } from '../composable/useToast'
import LoadingOverlay from '../components/backstage/LoadingOverlay.vue'

const router = useRouter()
const statusStore = useStatusStore()
const orderStore = useOrderStore()
const { isLoading } = storeToRefs(statusStore)
const { cart, cartTotal, clearCart, getCart } = useCart()
const { coupons, getCoupons } = useCouponStore()
const { createOrder } = orderStore

const finalOrder = ref(null) // 最終訂單

// 初始化購物車
getCart()

// 目前步驟
const currentStep = ref(1)

// 購買人資訊
const buyerInfo = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  note: ''
})

// 折價券
const couponCode = ref('') // 輸入的折價券代碼
const appliedCoupon = ref(null) // 已套用的折價券資訊

// 信用卡資訊
const cardInfo = ref({
  number: '',
  name: '',
  expiry: '',
  cvv: ''
})

// 運費
const shippingFee = ref(100)

// 折扣金額
const discountAmount = computed(() => {
  if (!appliedCoupon.value) return 0
  return Math.floor(cartTotal.value * appliedCoupon.value.percent / 100)
})

// 總計
const finalTotal = computed(() => {
  if (cartTotal.value > 499) {
    shippingFee.value = 0
  } else {
    shippingFee.value = 100
  }
  return cartTotal.value - discountAmount.value + shippingFee.value
})

// 套用折價券
const applyCoupon = () => {
  if (!couponCode.value.trim()) {
    showToast('請輸入折價券代碼', 'warning')
    return
  }

  // 測試用折價券列表
  // const availableCoupons = {
  //   'SALE20': { code: 'SALE20', title: '新春優惠', percent: 20 },
  //   'SAVE10': { code: 'SAVE10', title: '首購優惠', percent: 10 },
  //   'VIP30': { code: 'VIP30', title: 'VIP專屬', percent: 30 },
  //   'WELCOME15': { code: 'WELCOME15', title: '新會員優惠', percent: 15 }
  // }

  const coupon = availableCoupons[couponCode.value.toUpperCase()]

  if (coupon) {
    appliedCoupon.value = coupon
    showToast(`折價券套用成功！享 ${coupon.percent}% 折扣`, 'success')
  } else {
    showToast('無效的折價券代碼', 'error')
  }
}

// 移除折價券
const removeCoupon = () => {
  appliedCoupon.value = null
  couponCode.value = ''
  showToast('已移除折價券', 'info')
}

// 格式化信用卡號（每4位加空格）
const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\s/g, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  cardInfo.value.number = formattedValue
}

// 格式化有效期限（MM/YY）
const formatExpiry = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4)
  }
  cardInfo.value.expiry = value
}

// 圖片錯誤處理
const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/80x80?text=No+Image'
}

// 驗證表單
const validateForm = () => {
  // 驗證購買人資訊
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

  // 驗證信用卡資訊
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

// 處理結帳
const handleCheckout = () => {
  if (!validateForm()) return

  // 準備符合後端 API 格式的訂單資料
  const backendOrderData = {
    user: {
      name: buyerInfo.value.name,
      email: buyerInfo.value.email,
      tel: buyerInfo.value.phone,
      address: buyerInfo.value.address
    },
    message: buyerInfo.value.note || ''
  }

  // 準備本地儲存用的完整訂單資料
  const localOrderData = {
    id: `ORD-${Date.now()}${Math.floor(Math.random() * 1000)}`,
    orderNumber: `ORD-${Date.now()}`,
    date: new Date().toISOString(),
    is_paid: false, // 使用後端 API 的格式：is_paid 布林值
    items: JSON.parse(JSON.stringify(cart.value)),
    buyerInfo: {
      name: buyerInfo.value.name,
      phone: buyerInfo.value.phone,
      email: buyerInfo.value.email,
      address: buyerInfo.value.address,
      note: buyerInfo.value.note
    },
    paymentInfo: {
      method: 'credit_card',
      cardLast4: cardInfo.value.number.replace(/\s/g, '').slice(-4) || '****'
    },
    subtotal: cartTotal.value,
    discount: discountAmount.value,
    shippingFee: shippingFee.value,
    total: finalTotal.value,
    coupon: appliedCoupon.value ? {
      code: appliedCoupon.value.code,
      title: appliedCoupon.value.title,
      percent: appliedCoupon.value.percent
    } : null
  }

  showToast('付款處理中...', 'info')

  // 模擬付款
  setTimeout(async () => {
    try {
      // 1. 提交訂單到後端（使用後端格式）
      const result = await createOrder(backendOrderData)

      // 2. 準備儲存到 localStorage 的資料
      const existingOrders = JSON.parse(localStorage.getItem('memberOrders') || '[]')

      // 若後端有回傳 orderId，則使用後端的訂單編號
      if (result.orderId && !result.localOnly) {
        localOrderData.id = result.orderId
        localOrderData.orderNumber = result.orderId
        localOrderData.source = 'backend'
        console.log('✅ 訂單已送至後端，訂單編號:', result.orderId)
      } else {
        localOrderData.source = 'local'
        console.log('📦 訂單僅存於本地，訂單編號:', localOrderData.id)
      }

      // 3. 將訂單存入 localStorage（供前端訂單查詢頁面使用）
      existingOrders.unshift(localOrderData)
      localStorage.setItem('memberOrders', JSON.stringify(existingOrders))

      // 顯示成功訊息並更新步驟
      showToast('付款成功！', 'success')
      currentStep.value = 2

      // 清除購物車
      clearCart()

      // 延遲導向，讓使用者看到步驟完成動畫
      setTimeout(() => {
        router.push('/member/orders')
      }, 3000)
    } catch (error) {
      console.log('訂單建立失敗', error)
      showToast('訂單建立失敗，請稍後再試', 'error')
    }
  }, 2000)
  // setTimeout(() => {
  //   showToast('付款成功！', 'success')
  //   clearCart()
  //   router.push('/member/orders')
  // }, 2000)
}

onMounted(() => {
  getCoupons() // 取得可用的折價券列表
})
</script>

<style lang="scss" scoped>
// CSS Variables
$primary-color: #7030a0;
$secondary-color: #a855f7;
$gradient-primary: linear-gradient(135deg, $primary-color, $secondary-color);

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
    color: $primary-color;
  }
}

.page-subtitle {
  color: #718096;
  margin: 0;
  font-size: 0.95rem;
}

// ========== 結帳步驟提示 ==========
.checkout-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;

  margin: 0 0 2.5rem 0;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    gap: 0.5rem;
  }
}

.step {
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    gap: 0.75rem;
    flex-direction: column;
    text-align: center;
  }

  .step-number {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 700;
    background: #e2e8f0;
    color: #a0aec0;
    transition: all 0.3s ease;
    flex-shrink: 0;

    @media (max-width: 768px) {
      width: 42px;
      height: 42px;
      font-size: 1.1rem;
    }

    i {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }

  .step-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    @media (max-width: 768px) {
      gap: 0.125rem;
    }
  }

  .step-title {
    font-size: 1rem;
    font-weight: 700;
    color: #a0aec0;
    transition: color 0.3s ease;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }

  .step-description {
    font-size: 0.85rem;
    color: #cbd5e0;
    transition: color 0.3s ease;

    @media (max-width: 768px) {
      font-size: 0.75rem;
    }
  }

  // 目前步驟
  &.active {
    .step-number {
      background: $gradient-primary;
      color: white;
      box-shadow: 0 4px 12px rgba(112, 48, 160, 0.3);
    }

    .step-title {
      color: $primary-color;
    }

    .step-description {
      color: #718096;
    }
  }

  // 已完成步驟
  &.completed {
    .step-number {
      background: #22c55e;
      color: white;
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }

    .step-title {
      color: #22c55e;
    }

    .step-description {
      color: #718096;
    }
  }
}

.step-line {
  width: 100px;
  height: 3px;
  background: #e2e8f0;
  position: relative;
  transition: all 0.5s ease;

  @media (max-width: 768px) {
    width: 50px;
    height: 2px;
  }

  &.completed {
    background: #22c55e;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 100%;
      background: #22c55e;
      transform: translateY(-50%);
      animation: slideRight 0.5s ease;
    }
  }
}

@keyframes slideRight {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

.payment-content {
  position: relative;
  min-height: 100vh;
}

// 空狀態
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  i {
    font-size: 6rem;
    color: #cbd5e0;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    color: #2d3748;
    margin-bottom: 1rem;
  }

  p {
    color: #718096;
    font-size: 1rem;

    a {
      color: $primary-color;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        color: $secondary-color;
      }
    }
  }
}

// ========== 結帳容器 ==========
.checkout-container {
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 2.5rem;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 400px;
    gap: 2rem;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

// ========== 左側：付款資訊 ==========
.payment-info {
  width: 100%;
  min-height: 100vh;
}

.payment-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(112, 48, 160, 0.12);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 2rem 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f7fafc;

  i {
    color: $primary-color;
    font-size: 1.75rem;
  }
}

.info-section {
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-subtitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.25rem 0;

  i {
    color: $primary-color;
    font-size: 1.2rem;
  }
}

.section-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  margin: 2rem 0;
}

// ========== 表單樣式 ==========
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;

  &.full-width {
    grid-column: 1 / -1;
  }

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;

    .required {
      color: #e53e3e;
      margin-left: 2px;
    }
  }

  input,
  textarea {
    padding: 0.875rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.95rem;
    color: #2d3748;
    transition: all 0.3s ease;
    background: white;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 4px rgba(112, 48, 160, 0.1);
    }

    &::placeholder {
      color: #a0aec0;
    }

    &:disabled {
      background: #f7fafc;
      cursor: not-allowed;
      color: #a0aec0;
    }
  }

  textarea {
    resize: vertical;
    font-family: inherit;
    min-height: 80px;
  }
}

// ========== 折價券 ==========
.coupon-input-group {
  display: flex;
  gap: 0.75rem;

  input {
    flex: 1;
    padding: 0.875rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.95rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 4px rgba(112, 48, 160, 0.1);
    }

    &:disabled {
      background: #f7fafc;
      cursor: not-allowed;
    }
  }
}

.btn-apply-coupon {
  padding: 0.875rem 2rem;
  background: $gradient-primary;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(112, 48, 160, 0.35);
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
  }
}

.coupon-applied {
  margin-top: 1rem;
  padding: 0.875rem 1rem;
  background: #f0fdf4;
  border: 2px solid #86efac;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #166534;
  font-size: 0.9rem;
  animation: slideIn 0.3s ease;

  i {
    color: #22c55e;
    font-size: 1.2rem;
  }

  span {
    flex: 1;
    font-weight: 500;
  }
}

.btn-remove-coupon {
  background: none;
  border: none;
  color: #166534;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 4px;

  i {
    font-size: 1.25rem;
  }

  &:hover {
    color: #dc2626;
    background: rgba(220, 38, 38, 0.1);
  }
}

// ========== 右側：結帳明細 ==========
.order-summary-wrapper {
  width: 100%;
  position: sticky;
  top: 100px;
  align-self: start;
  max-height: calc(100vh - 120px);

  @media (max-width: 1024px) {
    position: static;
    max-height: none;
    margin-top: 2rem;
  }
}

.order-summary {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(112, 48, 160, 0.12);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.summary-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f7fafc;

  i {
    color: $primary-color;
    font-size: 1.4rem;
  }
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f7fafc;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 10px;
    transition: background 0.3s ease;

    &:hover {
      background: #a0aec0;
    }
  }
}

.summary-item {
  display: flex;
  gap: 0.875rem;
  align-items: center;
  padding: 0.75rem;
  border-radius: 10px;
  transition: background 0.2s ease;

  &:hover {
    background: #f7fafc;
  }
}

.item-image-small {
  width: 65px;
  height: 65px;
  border-radius: 10px;
  overflow: hidden;
  background: #f7fafc;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.item-details {
  flex: 1;
  min-width: 0;

  .item-name {
    font-size: 0.925rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 0.375rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
  }

  .item-quantity {
    font-size: 0.85rem;
    color: #718096;
    margin: 0;
  }
}

.item-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: $primary-color;
  white-space: nowrap;
}

.summary-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  margin: 1.25rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.875rem;
  font-size: 0.95rem;

  &.total-row {
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 2px solid #f7fafc;
    font-size: 1.2rem;
    font-weight: 700;
  }
}

.summary-label {
  color: #718096;
  font-weight: 500;
}

.summary-value {
  color: #2d3748;
  font-weight: 600;

  &.discount {
    color: #22c55e;
    font-weight: 700;
  }

  &.total-amount {
    color: $primary-color;
    font-size: 1.75rem;
    font-weight: 700;
  }
}

.btn-checkout {
  width: 100%;
  padding: 1.125rem;
  background: $gradient-primary;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  margin-top: 1.75rem;
  box-shadow: 0 4px 12px rgba(112, 48, 160, 0.25);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(112, 48, 160, 0.4);
  }

  &:active {
    transform: translateY(-1px);
  }

  i {
    font-size: 1.15rem;
  }
}

.payment-notice {
  text-align: center;
  margin-top: 1.125rem;
  font-size: 0.85rem;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem;
  background: #f7fafc;
  border-radius: 8px;

  i {
    color: #22c55e;
    font-size: 1rem;
  }
}

// ========== 動畫效果 ==========
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
</style>