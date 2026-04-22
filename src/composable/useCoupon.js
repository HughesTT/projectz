import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStatusStore } from '../store/statusStore'
import { useRouter } from 'vue-router'

export const useCouponStore = defineStore('couponStore',
  () => {
    // state 
    const router = useRouter()
    const coupons = ref([])
    const pages = ref({})
    const currentPage = ref(1)

    // actions 
    // 從 Cookie 讀取 Token 
    const getCookie = (name) => {
      const value = `; ${document.cookie}` // 前面加上分號和空格，確保能正確分割
      const parts = value.split(`; ${name}=`) // 根據名稱分割
      if(parts.length === 2) {
        return parts.pop().split(';').shift()
      }
      return null
    }

    const getCoupons = async (page = 1) => {
      const status = useStatusStore()
      status.isLoading = true

      try {
        // 設定 API 的環境變數，確保 API 路徑已設定，若未來環境變數改變，只需修改 .env 檔案，不須修改程式碼
        const apiBase = import.meta.env.VITE_APP_API
        const apiPath = import.meta.env.VITE_APP_PATH
        if (!apiBase || !apiPath) {
          throw new Error('環境變數未設定')
        }

        // 身分驗證 Token 
        const token = getCookie('userToken') // 從 Cookie 取得 userToken 的值

        if(!token) {
          alert('請先登入')
          router.push('/backstage')
          return
        }

        const api = `${apiBase}api/${apiPath}/admin/coupons?page=${page}` // 優惠券路徑
        const res = await fetch(api, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token // 加入身分驗證，確保後端能辨識並驗證
          },
        })
        const data = await res.json() // 設定data，將回應 res 轉換成JSON 格式

        // 處理後端回應
        if (data.success) { // 回應 success 時
          coupons.value = data.coupons || []
          pages.value = data.pagination || {}
          currentPage.value = page
        } else {
          // 驗證失敗
          if (data.message.includes('驗證錯誤') || data.message.includes('登入')) {
            alert('登入過期，請重新登入')
            document.cookie = 'userToken=;, expires=Thu, 01 Jan 1970 00:00:00 UTC'
            router.push('/backstage')
          } else {
            throw new Error(data.message) // 丟出錯誤訊息
          }
        }
      } catch (error) {
        console.error('取得優惠券失敗:', error)
        alert(`取得優惠券失敗: ${error.message}`)
      } finally {
        status.isLoading = false
      }
    }

    // 新增或更新優惠券
    const updateCoupon = async (item) => {
      const status = useStatusStore()
      status.isLoading = true

      try {
        const apiBase = import.meta.env.VITE_APP_API
        const apiPath = import.meta.env.VITE_APP_PATH
        const token = getCookie('userToken')

        if (!token) {
          throw new Error('請先登入')
        }

        // 判斷是新增還是編輯
        const isNew = !item.id
        const method = isNew ? 'POST' : 'PUT'
        const api = isNew 
          ? `${apiBase}api/${apiPath}/admin/coupon`
          : `${apiBase}api/${apiPath}/admin/coupon/${item.id}`
        
        const res = await fetch(api, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify({ data: item })
        })
        const data = await res.json()

        if (data.success) {
          await getCoupons()
          return { 
            success: true, 
            message: isNew ? '優惠券已新增' : '優惠券已更新'
          }
        } else {
          throw new Error(data.message || '操作失敗')
        }
      }
      catch (error) {
        console.error('優惠券操作錯誤:', error)
        return { success: false, message: error.message }
      } finally {
        status.isLoading = false
      }
    }

    // 刪除優惠券
    const deleteCoupon = async (couponId) => {
      const status = useStatusStore()
      status.isLoading = true

      try {
        const apiBase = import.meta.env.VITE_APP_API
        const apiPath = import.meta.env.VITE_APP_PATH
        const token = getCookie('userToken')

        if (!token) {
          throw new Error('請先登入')
        }

        const api = `${apiBase}api/${apiPath}/admin/coupon/${couponId}`

        const res = await fetch(api, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          }
        })

        const data = await res.json()

        if (data.success) {
          await getCoupons()
          return { success: true, message: '優惠券刪除成功'}
        } else {
          throw new Error(data.message || '刪除失敗')
        }
      } catch (error) {
        console.error('刪除優惠券失敗:', error)
        return { success: false, message: error.message }
      } finally {
        status.isLoading = false
      }
    }

    return {
      coupons,
      getCoupons,
      updateCoupon,
      deleteCoupon,
      pages
    }
  }
)