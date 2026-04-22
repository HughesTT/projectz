import { ref, computed } from 'vue'
import { showToast } from './useToast'

// 全局購物車狀態
const cart = ref([])
const cartIds = ref([])

export const useCart = () => {
  // 從 localStorage 載入購物車
  const getCart = () => {
    try {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        if (Array.isArray(parsedCart)) {
          cart.value = parsedCart
          cartIds.value = parsedCart.map(item => item.id)
        }
      }
    } catch (error) {
      console.error('載入購物車失敗:', error)
      cart.value = []
      cartIds.value = []
    }
  }

  // 儲存購物車到 localStorage
  const saveCart = () => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart.value))
      cartIds.value = cart.value.map(item => item.id)
    } catch (error) {
      console.error('儲存購物車失敗:', error)
    }
  }

  // 加入購物車
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.value.find(item => item.id === product.id)
    
    if (existingItem) {
      // 如果已存在，增加數量
      existingItem.quantity += quantity
      showToast(`已將「${product.title}」數量增加至 ${existingItem.quantity} 件`, 'success')
    } else {
      // 如果不存在，新增項目
      cart.value.push({
        ...product,
        quantity: quantity
      })
      showToast(`已將「${product.title}」加入購物車`, 'success')
    }
    
    saveCart()
  }

  // 更新購物車商品數量
  const updateQuantity = (productId, quantity) => {
    const item = cart.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveCart()
      }
    }
  }

  // 從購物車移除商品
  const removeFromCart = (productId) => {
    const index = cart.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      const removedItem = cart.value.splice(index, 1)[0]
      saveCart()
      showToast(`已將「${removedItem.title}」移出購物車`, 'info')
    }
  }

  // 清空購物車
  const clearCart = () => {
    cart.value = []
    cartIds.value = []
    localStorage.removeItem('cart')
  }

  // 計算總計
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  // 計算總件數
  const cartItemCount = computed(() => {
    return cart.value.reduce((count, item) => {
      return count + item.quantity
    }, 0)
  })

  return {
    cart,
    cartIds,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCart,
    cartTotal,
    cartItemCount
  }
}