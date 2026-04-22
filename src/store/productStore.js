import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useStatusStore } from '../store/statusStore'
import { useRouter } from 'vue-router'
import { showToast } from '../composable/useToast'

export const useProductStore = defineStore('productStore', () => {
  // state
  const router = useRouter()
  const products = ref([])
  const allProducts = ref([])
  const pages = ref({})
  // 預設選擇的分類
const selectedCategory = ref('all')
  
  // getters
  const sortProducts = computed(() => {
    // 備份 products.value ，避免直接修改原始資料
    return [...products.value].sort((a, b) => a.origin_price - b.origin_price)
  })

  // actions
  // 從 Cookie 讀取 Token
  const getCookie = (name) => {
    const value = `; ${document.cookie}` // 在前面加上分號和空格，確保能正確分割
    const parts = value.split(`; ${name}=`) // 根據名稱分割
    if(parts.length === 2) {
      return parts.pop().split(';').shift()
    }
    return null
  }

  // 格式化產品描述：將連續文字按空格分段
  const formatDescription = (text) => {
    if (!text || typeof text !== 'string') return text
    
    // 移除多餘的空白
    const cleanText = text.trim()
    
    // 按文中空格分割
    const segments = cleanText.split(' ').filter(segment => segment.trim())
    
    // 如果沒有句號，返回原文
    if (segments.length <= 1) return cleanText
    
    // 每個段落前添加項目符號，並用換行連接
    const formattedText = segments
      .map(segment => `${segment.trim()}`)
      .join('\n\n')
    
    return formattedText
  }


  // 取得全部資料
  const getAllProducts = async() => {
    const status = useStatusStore()
    status.isLoading = true

    try {
      const apiBase = import.meta.env.VITE_APP_API
      const apiPath = import.meta.env.VITE_APP_PATH

      const api = `${apiBase}api/${apiPath}/products/all`
      const res = await fetch(api, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await res.json()
      if(data.success) {
        // 格式化每個產品的描述文字
        allProducts.value = data.products.map(product => ({
          ...product,
          description: formatDescription(product.description),
          content: formatDescription(product.content)
        }))
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      alert(`取得產品失敗: ${error.message}`)
    } finally {
      status.isLoading = false
    }
  }

  // 取得一頁10筆資料
  const getProducts = async (page = 1) => {
    const status = useStatusStore()
    status.isLoading = true // 開始載入
    
    try {
      // 設定藉由API的環境變數，確保 API 路徑已設定，若未來環境變數改變，只需修改 .env 文件即可，無須修改程式碼
      const apiBase = import.meta.env.VITE_APP_API
      const apiPath = import.meta.env.VITE_APP_PATH
      if (!apiBase || !apiPath) { // 如環境變數為空，給予錯誤訊息
        throw new Error('環境變數未設定')
      }
      
      // 讀取身分驗證 Token
      const token = getCookie('userToken') // 從 Cookie 取得 userToken 的值

      if (!token) { // 若為空值，代表未登入
        alert('請先登入')
        router.push('/backstage') // 導向登入頁
        return
      }

      const api = `${apiBase}api/${apiPath}/admin/products?page=${page}` // 再加 /all 可取得完整產品資料

      // 取得產品資料，並加入身分驗證
      const res = await fetch(api, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // 加入身分驗證，確保後端能識別並驗證
        },
      })

      const data = await res.json() // 將回應的 res 解析為 JSON格式，並重新命名為 data

      // 處理回應
      if (data.success) {
        // 成功取得產品資料
        products.value = data.products
        pages.value = data.pagination
      } else {
        // 驗證失敗或其他錯誤
        if (data.message.includes('驗證錯誤') || data.message.includes('登入')) {
          alert('登入已過期，請重新登入')
          document.cookie = 'userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
          router.push('/backstage')
        } else {
          throw new Error(data.message) // 丟出錯誤訊息，讓 catch 處理
        }
      }
    } catch (error) {
      alert(`取得產品失敗: ${error.message}`)
    } finally {
      status.isLoading = false // 結束載入
    }
  }

  // 新增產品
  const createProduct = async (product) => {
    const status = useStatusStore()
    status.isLoading = true
    
    try {
      const apiBase = import.meta.env.VITE_APP_API
      const apiPath = import.meta.env.VITE_APP_PATH
      const token = getCookie('userToken')

      if (!token) {
        throw new Error('請先登入')
      }

      const api = `${apiBase}api/${apiPath}/admin/product`

      const res = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ data: product })
      })

      const data = await res.json()

      if (data.success) {
        // 新增成功後重新取得產品列表
        await getProducts()
        return { success: true, message: '產品新增成功' }
      } else {
        throw new Error(data.message || '新增失敗')
      }
    } catch (error) {
      console.error('新增產品錯誤:', error)
      return { success: false, message: error.message }
    } finally {
      status.isLoading = false
    }
  }

  // 更新產品
  const updateProduct = async (product) => {
    const status = useStatusStore()
    status.isLoading = true
    
    try {
      const apiBase = import.meta.env.VITE_APP_API
      const apiPath = import.meta.env.VITE_APP_PATH
      const token = getCookie('userToken')

      if (!token) {
        throw new Error('請先登入')
      }

      const api = `${apiBase}api/${apiPath}/admin/product/${product.id}`

      const res = await fetch(api, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ data: product })
      })

      const data = await res.json()

      if (data.success) {
        // 更新成功後重新取得產品列表
        await getProducts()
        return { success: true, message: '產品更新成功' }
      } else {
        throw new Error(data.message || '更新失敗')
      }
    } catch (error) {
      console.error('更新產品錯誤:', error)
      return { success: false, message: error.message }
    } finally {
      status.isLoading = false
    }
  }

  // 刪除產品
  const deleteProduct = async (productId) => {
    const status = useStatusStore()
    status.isLoading = true
    
    try {
      const apiBase = import.meta.env.VITE_APP_API
      const apiPath = import.meta.env.VITE_APP_PATH
      const token = getCookie('userToken')

      if (!token) {
        throw new Error('請先登入')
      }

      const api = `${apiBase}api/${apiPath}/admin/product/${productId}`

      const res = await fetch(api, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      })

      const data = await res.json()

      if (data.success) {
        // 刪除成功後重新取得產品列表
        await getProducts()
        return { success: true, message: '產品刪除成功' }
      } else {
        throw new Error(data.message || '刪除失敗')
      }
    } catch (error) {
      console.error('刪除產品錯誤:', error)
      return { success: false, message: error.message }
    } finally {
      status.isLoading = false
    }
  }

  // 導向指定產品頁面
  const goToProduct = (productId) => {
    router.push({ name: 'ProductId', params: { productId } })
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  watch(selectedCategory, () => {
    if (selectedCategory.value) { // 在分類變更時滾動到頂部
      scrollToTop()
    }
  })

  // 根據選擇的分類過濾產品
  const filteredProducts = computed(() => {
    // 過濾出 unit 為 headphone 的產品
    const headphones = allProducts.value.filter(product => product.unit === 'headphone')

    // 選擇全部，回傳所有耳機產品
    if (selectedCategory.value === 'all') {
      return headphones
    }

    // 根據選擇的分類進一步過濾
    // 這裡假設產品的 category 欄位存儲了子分類資訊
    return headphones.filter(product => {
      const category = product.category?.toLowerCase() || '' // 定義的 category 為小寫字串
      return category.includes(selectedCategory.value) ||
        category === selectedCategory.value.replace('-', ' ') // 處理分類有 '-' 的資料
    })
  })

  return {
    products,
    allProducts,
    sortProducts,
    getProducts,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    pages,
    goToProduct,
    selectedCategory,
    filteredProducts,
  }
})