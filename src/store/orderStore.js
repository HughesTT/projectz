import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStatusStore } from '../store/statusStore'
import { useRouter } from 'vue-router'

export const useOrderStore = defineStore('orderStore', () => {
  // state
  const router = useRouter()
  const orders = ref([])
  const pages = ref({})
  const currentPage = 1

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

  const getOrders = async (page = 1) => {
    const status = useStatusStore()
    status.isLoading = true // 開始載入
    
    try {
      // 設定藉由API的環境變數，確保 API 路徑已設定，若未來環境變數改變，只需修改 .env 檔案，不須修改程式碼
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

      const api = `${apiBase}api/${apiPath}/admin/orders?page=${page}`

      // 取得產品資料，並加入身分驗證
      const res = await fetch(api, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // 加入身分驗證，確保後端能識別並驗證
        },
      })

      const data = await res.json() // 將回應的 res 轉換成 JSON格式，並重新命名為 data

      // 處理後端回應
      if (data.success) {
        // 成功取得產品資料
        orders.value = data.orders
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

  // 新增訂單（會員前台）
  const createOrder = async (orderData) => {
    const status = useStatusStore()
    status.isLoading = true

    try {
      const apiBase = import.meta.env.VITE_APP_API
      const apiPath = import.meta.env.VITE_APP_PATH
      
      if (!apiBase || !apiPath) {
        throw new Error('環境變數未設定')
      }

      const api = `${apiBase}api/${apiPath}/order`

      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: orderData })
      })
      
      const data = await res.json()

      if (data.success) {
        return { success: true, message: '訂單建立成功', orderId: data.orderId }
      } else {
        throw new Error(data.message || '訂單建立失敗')
      }
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      status.isLoading = false
    }
  }

  // 更新訂單
  const updatePaid = async (item) => {
    const status = useStatusStore()
    status.isLoading = true
    
    try {
      const apiBase = import.meta.env.VITE_APP_API
      const apiPath = import.meta.env.VITE_APP_PATH
      const token = getCookie('userToken')

      if (!token) {
        throw new Error('請先登入')
      }

      const api = `${apiBase}api/${apiPath}/admin/order/${item.id}`
      const paid = { is_paid: item.is_paid}

      const res = await fetch(api, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ data: paid })
      })

      const data = await res.json()

      if (data.success) {
        // 更新成功後重新取得產品列表
        await getOrders(currentPage.value)
        return { success: true, message: '付款狀態已更新' }
      } else {
        throw new Error(data.message || '付款狀態更新失敗')
      }
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      status.isLoading = false
    }
  }

  // 刪除訂單
  const deleteOrders = async (orderId) => {
    const status = useStatusStore()
    status.isLoading = true
    
    try {
      const apiBase = import.meta.env.VITE_APP_API
      const apiPath = import.meta.env.VITE_APP_PATH
      const token = getCookie('userToken')

      if (!token) {
        throw new Error('請先登入')
      }


      const api = `${apiBase}api/${apiPath}/admin/order/${orderId}`

      const res = await fetch(api, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      })

      const data = await res.json()

      if (data.success) {
        // 刪除成功後重新取得訂單列表
        await getOrders()
        return { success: true, message: '訂單刪除成功' }
      } else {
        throw new Error(data.message || '刪除失敗')
      }
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      status.isLoading = false
    }
  }

  return {
    orders,
    getOrders,
    createOrder,
    updatePaid,
    deleteOrders,
    pages
  }
})