import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../composable/useToast'
const { showToast } = useToast()

// 建立處理登入登出的方法事件
export function useAuth() {
  const router = useRouter()
  
  const loginInfo = reactive({
    username:'',
    password: '',
  })
  // 定義 user 用於儲存登入成功的使用者資訊
  const user = ref({
    username: localStorage.getItem('userName') || '',
    isLoggedIn: !!localStorage.getItem('userToken')
  })

  const loading = ref(false) // 定義按鈕狀態，預防重複點擊登入

  const login = async() => {
    loading.value = true // 為 true 時，切換按鈕狀態
    try {
      const apiBase = import.meta.env.VITE_APP_API
      const api = `${apiBase}admin/signin`

      const res = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo) // 將 loginInfo 資料轉換成 JSON 格式
      })

      if (!res.ok) {
        throw new Error(`HTTP錯誤! 狀態: ${res.status}`)
      }

      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text()
        throw new Error('回傳值不是 json 格式')
      }

      const data = await res.json()
      if (data.success) {
        const { token, expired } = data
        document.cookie = `userToken=${token};expires=${new Date(expired)};`
        
        // 儲存使用者資訊
        localStorage.setItem('userToken', token)
        localStorage.setItem('userName', loginInfo.username)
        user.value = {
          username: loginInfo.username,
          isLoggedIn: true
        }
        showToast('登入成功！', 'success')
        router.push('/dashboard')
      } else {
        showToast(data.message || '登入失敗', 'error')
      }
    } catch (error) {
      showToast(`登入失敗: ${error.message}`, 'error')
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    const confirmed = window.confirm('確定要登出嗎?')
    if (confirmed) {
      showToast('登出成功', 'success')
      // 清除 Cookie 和 LocalStorage
      document.cookie = 'userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      localStorage.removeItem('userToken')
      localStorage.removeItem('userName')
      
      // 重置使用者狀態
      user.value = {
        username: '',
        isLoggedIn: false
      }
      
      router.push('/backstage')
      return true
    }
    return false
  }

  return { loginInfo, login, logout, loading, user }
}