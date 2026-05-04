import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStatusStore } from '../store/statusStore'
import { useOrderStore } from '../store/orderStore'
import { useCart } from './useCart'
import { showToast } from './useToast'

/**
 * 結帳邏輯 Composable
 * 負責處理優惠券驗證、購物車同步、訂單建立等流程
 */
export const useCheckout = () => {
  const router = useRouter()
  const statusStore = useStatusStore()
  const orderStore = useOrderStore()
  const { cart, cartTotal, clearCart } = useCart()

  const appliedCoupon = ref(null)

  /**
   * 同步購物車到後端
   */
  const syncCartToBackend = async () => {
    const apiBase = import.meta.env.VITE_APP_API
    const apiPath = import.meta.env.VITE_APP_PATH
    
    try {
      // 步驟 1: 先清空後端購物車（避免重複累積）
      const deleteUrl = `${apiBase}api/${apiPath}/carts`
      const deleteRes = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      
    } catch (error) {
      console.warn(error)
    }
    
    // 步驟 2: 將前端購物車商品加入後端
    for (const item of cart.value) {
      const cartData = {
        product_id: item.id,
        qty: item.quantity
      }

      const cartUrl = `${apiBase}api/${apiPath}/cart`
      const cartRes = await fetch(cartUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: cartData })
      })

      const cartResult = await cartRes.json()
      if (!cartResult.success) {
        throw new Error(`同步購物車失敗：${cartResult.message}`)
      }
    }
  }

  /**
   * 驗證並套用優惠券
   * @param {string} couponCode - 優惠券代碼
   * @returns {Promise<boolean>} - 是否成功套用
   */
  const applyCoupon = async (couponCode) => {
    if (!couponCode.trim()) {
      showToast('請輸入折價券代碼', 'warning')
      return false
    }

    if (cart.value.length === 0) {
      showToast('購物車是空的，無法套用優惠券', 'warning')
      return false
    }

    statusStore.isLoading = true

    try {
      const apiBase = import.meta.env.VITE_APP_API
      const apiPath = import.meta.env.VITE_APP_PATH

      if (!apiBase || !apiPath) {
        throw new Error('環境變數未設定')
      }

      // 步驟 1: 先同步購物車到後端
      await syncCartToBackend()

      // 步驟 2: 驗證並套用優惠券
      const api = `${apiBase}api/${apiPath}/coupon`
      
      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { code: couponCode.trim() } })
      })

      const result = await res.json()

      if (result.success) {
        const backendFinalTotal = result.data?.final_total
        
        if (backendFinalTotal) {
          const originalTotal = Number(cartTotal.value) || 0
          const finalPrice = Number(backendFinalTotal) || 0
          const calculatedDiscount = originalTotal - finalPrice
          const calculatedPercent = originalTotal > 0 
            ? Math.round((calculatedDiscount / originalTotal) * 100) 
            : 0
          
          appliedCoupon.value = {
            code: couponCode.trim(),
            title: result.message || '優惠券',
            percent: calculatedPercent,
            discountAmount: calculatedDiscount,
            backendFinalTotal: finalPrice
          }
          
          showToast(`折價券套用成功！折扣 $${calculatedDiscount.toLocaleString()}`, 'success')
          return true
        }
      } else {
        showToast(result.message || '無效的折價券代碼', 'error')
        return false
      }
    } catch (error) {
      showToast(error.message || '優惠券驗證失敗，請稍後再試', 'error')
      return false
    } finally {
      statusStore.isLoading = false
    }
  }

  /**
   * 移除優惠券
   */
  const removeCoupon = () => {
    appliedCoupon.value = null
    showToast('已移除折價券', 'info')
  }

  /**
   * 建立訂單
   * @param {Object} orderData - 訂單資料（包含用戶資訊、備註、信用卡資訊等）
   * @param {Object} additionalInfo - 額外資訊（含 cardInfo, shippingFee, finalTotal）
   * @returns {Promise<Object>} - 訂單建立結果
   */
  const createOrder = async (orderData, additionalInfo = {}) => {
    statusStore.isLoading = true

    try {
      const apiBase = import.meta.env.VITE_APP_API
      const apiPath = import.meta.env.VITE_APP_PATH

      // 準備訂單資料
      const finalOrderData = { ...orderData }

      // 如果有套用優惠券，加入優惠券代碼
      if (appliedCoupon.value && appliedCoupon.value.code) {
        finalOrderData.coupon_code = appliedCoupon.value.code
      }

      // 建立訂單
      const result = await orderStore.createOrder(finalOrderData)

      if (result.success) {
        showToast('訂單建立成功！', 'success')

        // 🔹 儲存訂單到 localStorage 供前端查詢
        const { cardInfo, shippingFee, finalTotal } = additionalInfo
        
        // 計算折扣金額
        const discountAmount = appliedCoupon.value?.discountAmount || 0
        
        const localOrder = {
          orderId: result.orderId || Date.now().toString(),
          createAt: new Date().toISOString(),
          items: cart.value.map(item => ({
            product_id: item.id,
            product: {
              title: item.title,
              imageUrl: item.imageUrl,
              price: item.price
            },
            qty: item.quantity,
            final_total: item.price * item.quantity
          })),
          user: orderData.user,
          message: orderData.message,
          total: finalTotal || cartTotal.value,
          status: {
            paid: false,
            text: '未付款'
          },
          paymentInfo: cardInfo ? {
            cardLastFour: cardInfo.number.slice(-4),
            cardHolder: cardInfo.name
          } : null,
          coupon: appliedCoupon.value ? {
            title: appliedCoupon.value.title,
            percent: appliedCoupon.value.percent,
            discount: discountAmount
          } : null,
          shippingFee: shippingFee || 0
        }

        // 儲存到 localStorage
        const existingOrders = JSON.parse(localStorage.getItem('memberOrders') || '[]')
        existingOrders.unshift(localOrder)
        localStorage.setItem('memberOrders', JSON.stringify(existingOrders))

        // 清空購物車
        await clearCart()

        return {
          success: true,
          orderId: result.orderId
        }
      } else {
        showToast(`訂單建立失敗：${result.message}`, 'error')
        return {
          success: false,
          message: result.message
        }
      }
    } catch (error) {
      showToast('結帳失敗，請稍後再試', 'error')
      return {
        success: false,
        message: error.message
      }
    } finally {
      statusStore.isLoading = false
    }
  }

  return {
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    createOrder,
    syncCartToBackend
  }
}
